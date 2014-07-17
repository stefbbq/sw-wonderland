<?php
require_once 'autoload.inc.php';

use wpl\wplPortal\AdminManager;
use sdg\data\Result;

$manager = new AdminManager();

$action = isset($_GET['action']) ? htmlspecialchars($_GET['action']) : false;

$result = new Result();


switch ($action) {
    case 'add':
        $result = $manager->saveClient(
                getValue('name'), 
                getValue('address'), 
                getValue('city'), 
                getValue('province'), 
                getValue('postalCode'), 
                getValue('email'), 
                getValue('phone1'), 
                getValue('phone2'), 
                getValue('repEmail')
                );
        break;
    case 'update':
        $result = $manager->saveClient(
                getValue('name'), 
                getValue('address'), 
                getValue('city'), 
                getValue('province'), 
                getValue('postalCode'), 
                getValue('email'), 
                getValue('phone1'), 
                getValue('phone2'), 
                getValue('repEmail'),
                getValue('id')
                );
        break;
    case 'list':
        $result = $manager->getClientList();
        break;
    default : 
        $result->success = false;
        $result->message = 'no action';
        break;
}

function getValue($name) {
    return htmlspecialchars($_GET[$name]);
}

/*
 * Return JSON
 */
$callback = htmlspecialchars($_GET['callback']);
echo ($callback . '(' . json_encode($result) . ');');

