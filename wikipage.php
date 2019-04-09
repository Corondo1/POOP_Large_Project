<?php
	include("config.php");
	
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$obj = json_decode(file_get_contents('php://input'), true);
		$response = new \stdClass();
		$pageID = $obj['id'];
		$access = $obj['access'];
		$response = getPage($pageID, $access);
		echo json_encode($response);
		exit();
	}
	
	if($_SERVER["REQUEST_METHOD"] == "GET")
	{
		$response = new \stdClass();
		$pageID = $_GET['id'];
		$access = $_SESSION['access'];
		$response = getPage($pageID, $access);
		echo json_encode($response);
		exit();
	}
	
	function getPage($id, $userAccess)
	{
		//https://stackoverflow.com/questions/6902128/getting-data-from-the-url-in-php
		
		$conn = getDatabase();
		$retval = new \stdClass();
		
		if(mysqli_connect_errno($conn))
		{
			$retval->text = "MySqli connect error";
		}
		else
		{
			//SELECT `title` FROM `Pages` WHERE `id` = 3 AND `access` <= 42
			$stmt = $conn->prepare("SELECT title FROM Pages WHERE id = ? AND access <= ? ");
			$stmt->bind_param("ii", $id, $userAccess);
			$stmt->execute();
			
			$stmt->bind_result($title);
			$stmt->store_result();
		
			if($stmt->num_rows() < 1)
			{
				$response->text = "Nothing Found";
			}
			else
			{
								//title[]
									//access[]
								//sections[] = https://stackoverflow.com/questions/8612190/array-of-php-objects
				$response->title = array();
				$response->access = array();
				$response->sections = array();
				
				while($stmt->fetch())
				{
					$response->title[] = $title;
					$stmtSections = $conn->prepare(SELECT 
					
					$stmtSections->execute();
					
					$stmt->bind_result($
				
				//$response->sections[] = ;
				}
			}
		}
		
		return $response;
	}
?>