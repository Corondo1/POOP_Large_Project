<?php
	include("config.php");
	
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$conn = getDataBase();
		$obj = json_decode(file_get_contents('php://input'), true);
		
		$response = new \stdClass();
		if(mysqli_connect_errno($conn))
		{
			$response->text = "Mysqli connect error";
		}
		else
		{
			$pageTitle = $obj["page_title"];
			$editorId = $obj["editor_id"];
			$lastEdit = time();
			$access = 2;
			$stmt = $conn->prepare("INSERT INTO Pages (title, editor_id, last_edit, access) VALUES (?,?,?,?)");
			
			$stmt->bind_param("siii", $pageTitle, $editorId, $lastEdit, $access);
			$stmt->execute();
			
			$stmt->close();
			$response->text = "succces {$pageTitle} {$editorId} {$lastEdit} {$access}";
		}
		
		$conn->close();
		echo json_encode($response);
		exit();
	}
?>