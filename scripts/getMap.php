<?php 

if ( !empty($_GET['adr']) ) {
	$adr = $_GET['adr'];
}else{
	die();
}

$headers = array(
	"Referer:http://playrust.io/map/",
);

$ch = curl_init();

curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
curl_setopt($ch, CURLOPT_ENCODING , "gzip");
curl_setopt($ch, CURLOPT_BINARYTRANSFER,1);
curl_setopt($ch, CURLOPT_VERBOSE , 1);
curl_setopt($ch, CURLOPT_URL, 'http://'.$adr.'/map.jpg');

$data = curl_exec($ch);
curl_close($ch);


header('Content-Type: image/jpeg');

//imagejpeg($data);

echo($data);











 ?>