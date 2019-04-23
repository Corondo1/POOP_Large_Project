<?php
	include("config.php");
	try_session();
	
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$response = new \stdClass();
		if(!($_SESSION['isLoggedIn']))
		{
			$response->state = 2; //User not logged in
		}

		$conn = getDataBase();				
		if(mysqli_connect_errno($conn))
		{
			$response->state = 3; //"Mysqli connect error";
		}
		else
		{
			$pageTitle = "DEFAULT_TITLE";
			if(!isset($_SESSION['id']))
			{
				$_SESSION['id'] = 999;
			}
			$editorId = $_SESSION['id'];
			$lastEdit = time();
			$access = 2;
			$stmt = $conn->prepare("INSERT INTO Pages (title, editor_id, last_edit, access) VALUES (?,?,?,?)");
			
			$stmt->bind_param("siii", $pageTitle, $editorId, $lastEdit, $access);
			$stmt->execute();
			
			
			if(!($conn->insert_id == 0))
			{
				$response->state = 1; //Success
				$response->page_id = $conn->insert_id;
				$response->access = 2;
			}
			else
			{
				$response->state = 4; // Failure to insert
			}
		}
		$stmt->close();
		$conn->close();
		echo json_encode($response);
		exit();
	}
?>