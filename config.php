<?php
	function getDataBase()
	{
		define('DB_SERVER', '127.0.0.1');
		define('DB_USERNAME', 'poop_default');
		define('DB_PASSWORD', 'EC6p~$[s,!G+');
		define('DB_DATABASE', 'poop_Yeetipedia');
		$db = mysqli_connect(DB_SERVER,DB_USERNAME,DB_PASSWORD,DB_DATABASE);
		return $db;
	}
	
	function try_session()
	{
		if(ini_get('session.use_cookies') && isset($_COOKIE['PHPSESSID']))
		{
			$sessid = $_COOKIE['PHPSESSID'];
		}
		else if(!ini_get('session.use_only_cookies') && isset($_GET['PHPSESSID']))
		{
			$sessid = $_GET['PHPSESSID'];
		}
		else
		{
			session_start();
			return false;
		}
		
		if(!preg_match('/^[a-z0-9]{32}$/', $sessid))
		{
			return false;
		}
		session_start();
		return true;
	}

?>
