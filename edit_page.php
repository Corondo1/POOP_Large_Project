<?php
	include("config.php");
	try_session();
	
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$response = new \stdClass();
		if($_SESSION['isLoggedIn'])
		{
			$response = edit_page();
		}
		else
		{
			$response->state = 2; //user not logged in
		}
		echo json_encode($response);
		exit();
	}
	
	function edit_page()
	{
		$conn = getDataBase();
		$obj = json_decode(file_get_contents('php://input'), true);
		
		$response = new \stdClass();
		$response->obj = $obj;
		if(mysqli_connect_errno($conn))
		{
			$response->state = 3; //"Mysqli connect error";
		}
		else
		{
			$pageTitle = $obj["page_title"];
			$pageId = $obj["page_id"];
			$pageDesc = $obj["page_description"];
			$team = $obj["team"];
			
			$stmt = $conn->prepare("SELECT * FROM Pages WHERE id = ?");
			$stmt->bind_param("i", $pageId);
			$stmt->execute();
			
			$stmt->store_result();
			
			$stmtUpdatePage = $conn->prepare("UPDATE Pages SET title = ?, description = ?, team = ? WHERE id = ?");
			$stmtUpdatePage->bind_param("sssi", $pageTitle, $pageDesc, $team, $pageId);
			
			/*
			if($_SESSION['access'] < 4)
			{
				$stmtReApprove = $conn->prepare("UPDATE Pages SET access = 2 WHERE id = ?");
				$stmtReApprove->bind_param("i", $pageId);
				if(!($stmtReApprove->execute()))
				{
					$response->state = 0;
					$stmtReApprove->close();
					$stmtUpdatePage->close();
					$stmt->close();
					return $response;
				}
				$stmtReApprove->close();
			}
			*/
			if($stmtUpdatePage->execute())
			{
				if($stmt->num_rows() < 1)
				{
					$response->state = 0; // "page does not exist in database";
				}
				else
				{
					$stmtRemoveSections = $conn->prepare("DELETE FROM Sections WHERE page_id = ?");
					$stmtRemoveSections->bind_param("i", $pageId);
					if(!($stmtRemoveSections->execute()))
					{
						$response->state = 0; //Error
					}
					$stmtRemoveSections->close();
					
					$section = new \stdClass();
					//$response->foundSec = array();
					$i = 0;
					foreach($obj["sections"] as $value)
					{
						$section = $obj["sections"][$i];
						//$response->foundSec[] = $section;

						$stmtSectionAdd = $conn->prepare("INSERT INTO Sections (page_id, rank, heading, content, pic_loc) VALUES (?,?,?,?,?)");
						$stmtSectionAdd->bind_param("iisss", $pageId, $rank, $heading, $content, $pic_loc);
						$rank = $section['index'];
						$heading= $section["section_title"];
						$content = $section["section_text"];
						$pic_loc = $section["pic_loc"];
						
						$stmtSectionAdd->execute();
						$stmtSectionAdd->close();
						$i++;
					}
						$response->state = 1; //Success
				}
			}
			$stmtUpdatePage->close();
			$stmt->close();
		}
		//$response->conn = $conn;
		$conn->close();
		
		return $response;
	}
?>