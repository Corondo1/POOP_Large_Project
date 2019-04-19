<?php
	include("config.php");
	try_session();
	
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$obj = json_decode(file_get_contents('php://input'), true);
		
		$response = new \stdClass();
		
		$pageId = $obj['id'];
		$access = $_SESSION['access'];
		if($_SESSION['isLoggedIn'])
		{
			if($access > 3)
			{
				$conn = getDatabase();
				
				$stmt = $conn->prepare("DELETE FROM Sections WHERE page_id = ?");
				$stmt->bind_param("i", $pageId);
				$stmt->execute();
				$stmt->close();
				
				$stmtDeletePage = $conn->prepare("DELETE FROM Pages WHERE id = ?");
				$stmtDeletePage->bind_param("i", $pageId);
				$stmtDeletePage->execute();
				$stmtDeletePage->close();
				
				$response->state = 1; //Success
			}
			else
			{
				$response->state = 4 //Not logged in, access denied;
			}
		}
		else
		{
			$response->state = 2; //User not logged in
		}
		
		echo json_encode($response);
	}
?>