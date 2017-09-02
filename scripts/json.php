<?php 

include_once($_SERVER['DOCUMENT_ROOT'] . '/rust/scripts/' . 'function.php');

header("Content-type: text/txt");

if (!empty($_GET['adr']) && !empty($_GET['type'])) {
	$adr = $_GET['adr'];
	$type = $_GET['type'];
}else{
	die();
}


$info = get_server_info_json($adr, $type);
echo $info;
?>