<?php 
header("Content-type: text/txt");

if (!empty($_GET['adr'])) {
	$adr = $_GET['adr'];
}else{
	die();
}

$c = curl_init('http://'.$adr.'/monuments.json');

curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($c, CURLOPT_TIMEOUT, 2);
curl_setopt($c, CURLOPT_ENCODING, "gzip");
$obj = curl_exec($c);

echo $obj;
?>