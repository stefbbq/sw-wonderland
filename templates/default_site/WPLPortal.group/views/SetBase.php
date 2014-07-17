<?php
$base = $_SERVER['REQUEST_URI'];
$base = substr($base, 0, strrpos($base, '/views') + 1 );

