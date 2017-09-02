<?php 
	require_once($_SERVER['DOCUMENT_ROOT'] . '/rust/' . 'config.php');

	function file_get_contents_curl($url) {
		$ch = curl_init();

		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //Устанавливаем параметр, чтобы curl возвращал данные, вместо того, чтобы выводить их в браузер.
		curl_setopt($ch, CURLOPT_ENCODING , "gzip");
		curl_setopt($ch, CURLOPT_URL, $url);

		$data = curl_exec($ch);
		curl_close($ch);

		return $data;
	}

	function steam_get_info($steam_id, $steam_api = STEAM_API_KEY){
		if ($user_info = file_get_contents_curl('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='.$steam_api.'&steamids='.$steam_id)) {
			$user_info = json_decode($user_info, true);
			$user_info = $user_info['response']['players'][0];
			return $user_info;
		}else{
			return false;
		}
	}

	function get_server_info($ip = IP, $port = PORT){
		if ($status = file_get_contents_curl('http://'.$ip.':'.$port.'/status.json')) {
			$server_info['status'] = json_decode($status, true);
		}

		if ($recent = file_get_contents_curl('http://'.$ip.':'.$port.'/recent.json')) {
			$server_info['recent'] = json_decode($recent, true);
		}

		if ($config = file_get_contents_curl('http://'.$ip.':'.$port.'/config.json')) {
			$server_info['config'] = json_decode($config, true);
		}

		return $server_info;	
	}

	function get_server_info_json($ip, $type){
		switch ($type) {
			case 'status':
				if ($status = file_get_contents_curl('http://'.$ip.'/status.json')) {
					return $status;
				}
			break;

			case 'recent':
				if ($recent = file_get_contents_curl('http://'.$ip.'/recent.json')) {
					return $recent;
				}
			break;
				
			case 'config':
				if ($config = file_get_contents_curl('http://'.$ip.'/config.json')) {
					return $config;
				}
			break;
		}

		return false;
	}




	/************************************************************************************/



	if ( !empty($_GET['ajax']) ) {

		if ( $_GET['ajax'] == 'status' ) {
			if ( !empty( $_GET['adr'] )  ) {
				$data = file_get_contents_curl($_GET['adr'] . '/status.json');
				header("Content-type: text/txt");
				echo $data;
			}
		}

	}







 ?>