<?php
	include("config.php");
	try_session();
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$response = new \stdClass();
		
		$_SESSION['isLoggedIn'] = false;
		$_SESSION['access'] = 0;
		$response->state = 1;
		$response->access = $_SESSION['access'];
		echo json_encode($response);
		exit();
	}
?>