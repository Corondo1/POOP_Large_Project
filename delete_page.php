<?php
	include("config.php");
	
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$obj = json_decode(file_get_contents('php://input'), true);
		
		$response = new \stdClass();
		
		$pageId = $obj['id'];
		$access = $obj['access'];
		
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
			
			$response->status = "Success";
		}
		else
		{
			$response->status = "Access Denied";
		}
		
		echo json_encode($response);
	}
?>