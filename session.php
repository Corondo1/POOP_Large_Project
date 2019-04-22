<?php
	include("config.php");
	try_session();
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$response = new \stdClass();
		
		if($_SESSION['isLoggedIn'])
		{
			$response->logged_in = true;
			$response->access = $_SESSION['access'];
		}
		else
		{
			$response->logged_in = false;  //Covers if isLoggedIn is NULL
			$response->access = 0;
		}
		
		echo json_encode($response);
		exit();
	}
?>