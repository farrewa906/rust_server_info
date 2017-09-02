<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/rust/scripts/' . 'function.php');


if ( !empty($_GET['steamID']) ){
	$player_info = steam_get_info($_GET['steamID'], STEAM_API_KEY);

	if ( empty($player_info) ) {
		$image = imagecreatefromjpeg($_SERVER['DOCUMENT_ROOT'] . '/rust/resorse/rustico.png');
	}else{
		$image = imagecreatefromjpeg($player_info['avatarmedium']);
	}

	header('content-type: image/png');
	imagepng($image);
	imagedestroy($image);
}