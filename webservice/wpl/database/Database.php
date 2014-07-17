<?php
/**
 * Created by PhpStorm.
 * User: Scott
 * Date: 17/12/13
 * Time: 8:27 PM
 */

namespace wpl\database;

use PDO;

class Database {

    public $db;

    public function __construct() {
        $dbServer = '192.186.249.99';
        $database = 'wonderlandee';
        $username = 'wonder_db';
        $password = 'W)ND#R_db';

        $this->db = new PDO("mysql:host={$dbServer};dbname={$database}", $username, $password);
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function close() {
        $this->db = null;
    }

    public function select($table, $select, $where=NULL){
        $cols = $conditions = '';
        $return = array();
        $i=0;
        foreach($select as $col => $data){
            if($i==0){
                $cols .= $data;
            }else{
                $cols .= ','.$data;
            }
            $i++;
        }
        $i=0;
        if($where){
            foreach($where as $col => $data){
                if($i==0){
                    $conditions .= $col." = '".$data."'";
                }else{
                    $conditions .= " AND ".$col." = '".$data."'";
                }
                $i++;
            }
            $query = $this->db->prepare("SELECT ".$cols." FROM ".$table." WHERE ".$conditions);
        }else{
            $query = $this->db->prepare("SELECT ".$cols." FROM ".$table);
        }
        try {
            $query->execute();
            for($i=0; $row = $query->fetch(); $i++){
                $return[$i] = array();
                foreach($row as $key => $rowItem){
                    $return[$i][$key] = $rowItem;
                }
            }
        }catch (\PDOException $e) {
            echo $e->getMessage();
        }
        $query->closeCursor();

        //var_dump($query);

        return $return;
    }

    public function add($table, $fieldNames){
        $cols = $values = '';
        $i=0;
        foreach($fieldNames as $col => $data){
            if($i==0){
                $cols .= $col;
                $values .= "'$data'";
            }else{
                $cols .= ','.$col;
                $values .= ','."'$data'";
            }
            $i++;
        }
        try {
            $query = $this->db->prepare("INSERT INTO ".$table." (".$cols.") VALUES (".$values.")");
            $result = $query->execute();
            $query->closeCursor();
            return $query->rowCount();
        }catch (\PDOException $e) {
            echo $e->getMessage();
            return false;
        }
    }

    public function update($table, $insert, $where){
        $condition = '';
        $cols = '';
        $i=0;
        foreach($insert as $col => $data){
            if($i==0){
                $cols .= "`".$col."`='".$data."'";
            }else{
                $cols .= ",`".$col."`='".$data."'";
            }
            $i++;
        }
        $c=0;
        foreach($where as $col => $value){
            if($c==0){
                $condition = $col.'='.$value;
            }else{
                $condition = " AND ".$col.'='.$value;
            }
        }
        $query = "UPDATE `".$table."` SET ".$cols." WHERE ".$condition;
        $result = $this->db->query($query);
        $result->closeCursor();
    }

    public function delete($tablename, $where){
        $condition = '';
        $i=0;
        foreach($where as $col => $data){
            if($i==0){
                $condition = $col.'='.$data;
            }else{
                $condition = " AND ".$col.'='.$data;
            }
        }
        $query = "DELETE FROM `".$tablename."` WHERE ".$condition;
        $result = $this->db->query($query);
        return $result->rowCount();
    }


    /*
      * GUID
      */
    public function generateGUID() {
        return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            // 32 bits for "time_low"
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),

            // 16 bits for "time_mid"
            mt_rand( 0, 0xffff ),

            // 16 bits for "time_hi_and_version",
            // four most significant bits holds version number 4
            mt_rand( 0, 0x0fff ) | 0x4000,

            // 16 bits, 8 bits for "clk_seq_hi_res",
            // 8 bits for "clk_seq_low",
            // two most significant bits holds zero and one for variant DCE1.1
            mt_rand( 0, 0x3fff ) | 0x8000,

            // 48 bits for "node"
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
        );
    }


    /****************************************************************************************************
     * Get Member ID from Token
     ****************************************************************************************************/
    public function getMemberIDFromToken($memberToken) {
        $conditions = array();
        $conditions['token'] = $memberToken;

        $dbResult = $this->select("members", array('id'), $conditions);
        $result = -1;
        if (count($dbResult) > 0) {
            $result = $dbResult[0]['id'];
        }
        return $result;
    }

} 