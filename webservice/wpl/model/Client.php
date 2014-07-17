<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace wpl\model;

/**
 * Description of Client
 *
 * @author Scott David Garson
 */
class Client {
    
    public $guid, $name, $address, $city, $province, $postal_code, $email, $phone, $phone2, $wplEmail;
    
    public function __construct() {
        
    }
    
}
