<?php
	include("config.php");
	try_session();
	
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$obj = json_decode(file_get_contents('php://input'), true);
		$response = new \stdClass();
		$pageID = $obj['id'];
		$access = $_SESSION['access'];
		$response = getPage($pageID, $access);
		//$response->AccessTest = $_SESSION[$usernameDB];
		echo json_encode($response);
		exit();
	}
	
	if($_SERVER["REQUEST_METHOD"] == "GET")
	{
		$response = new \stdClass();
		$pageID = $_GET['id'];
		$access = $_SESSION['access'];
		$response = getPage($pageID, $access);
		$response->AccessTest = $_SESSION[$usernameDB];
		echo json_encode($response);
		exit();
	}
	
	function getPage($id, $userAccess)
	{
		//https://stackoverflow.com/questions/6902128/getting-data-from-the-url-in-php
		if($_SESSION['access'] == NULL)
		{
			$_SESSION['access'] = 0;
		}
		$conn = getDatabase();
		$response = new \stdClass();
		
		if(mysqli_connect_errno($conn))
		{
			$response->state = 3; //"MySqli connect error";
		}
		else
		{
			//SELECT `title` FROM `Pages` WHERE `id` = 3 AND `access` <= 42
			$stmt = $conn->prepare("SELECT title, id FROM Pages WHERE id = ? AND access <= ? ");
			$stmt->bind_param("ii", $id, $userAccess);
			$stmt->execute();
			
			$stmt->bind_result($title, $pageID);
			$stmt->store_result();
		
			if($stmt->num_rows() < 1)
			{
				$response->state = 0; //"Nothing Found and or access denied";
			}
			else
			{
				$response->state = 1; //"Success, Page found"
								//sections[] = https://stackoverflow.com/questions/8612190/array-of-php-objects

				$response->sections = array();
				
				while($stmt->fetch())
				{
					$response->title = $title;
					$response->pageId = $pageID;
					$stmtSections = $conn->prepare("SELECT rank, heading, content, pic_loc, caption FROM Sections WHERE page_id = ? ");
					$stmtSections->bind_param("i", $pageID);
					
					$stmtSections->execute();
					
					$stmtSections->bind_result($rank, $heading, $content, $pic_loc, $caption);
					$stmtSections->store_result();
					if($stmtSections->num_rows() < 1)
					{
					
					}
					else
					{
						while($stmtSections->fetch())
						{
							$section = new \stdClass();
							$section->rank = $rank;
							$section->heading = $heading;
							$section->content = $content;
							$section->pic_loc = $pic_loc;
							$section->caption = $caption;
							
							$response->sections[] = $section;
						}
					}
				}
			}
		}
		
		return $response;
	}
?>