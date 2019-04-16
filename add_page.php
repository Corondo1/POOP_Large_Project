<?php
	include("config.php");
	
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$conn = getDataBase();
		$obj = json_decode(file_get_contents('php://input'), true);
		
		$response = new \stdClass();
		if(mysqli_connect_errno($conn))
		{
			$response->status = "Mysqli connect error";
		}
		else
		{
			$pageTitle = $obj["page_title"];
			$editorId = $obj["editor_id"];
			$time = time();
			$lastEdit = date("Y-m-d", $time);
			$access = 2;
			
			$stmt = $conn->prepare("INSERT INTO Pages (title, editor_id, last_edit, access) VALUES (?,?,?,?)");
			$stmt->bind_param("siii", $pageTitle, $editorId, $lastEdit, $access);
			$stmt->execute();

			/*
			$stmtGetPage = $conn->prepare("SELECT id FROM Pages WHERE title = ?");
			$stmtGetPage->bind_param("s", $pageTitle);
			$stmtGetPage->execute();
				
			$stmtGetPage->bind_result($pageId);
			$stmtGetPage->store_result();
			*/
			//if($stmtGetPage->num_rows() < 1)
			if($conn->insert_id == 0)
			{
				$response->status = "Error finding added page";
			}
			else
			{
			$pageId = $conn->insert_id;
			//do we assume I get a $obj["sections"] = sections[] with sections[0] having sections[0][title] section[0][content]
			//https://stackoverflow.com/questions/1176352/pdo-prepared-inserts-multiple-rows-in-single-query
				$temp_array = array();
				$section = new \stdClass();
				//$response->foundSec = array();
				$i = 0;
				foreach($obj["sections"] as $value)
				{
					$section = $obj["sections"][$i];
					//$response->foundSec[] = $section;

					$stmtTestAdd = $conn->prepare("INSERT INTO Sections (page_id, rank, heading, content) VALUES (?,?,?,?)");
					$stmtTestAdd->bind_param("iiss", $temp_array[0], $temp_array[1], $temp_array[2], $temp_array[3]);
					$temp_array[0] = $pageId;
					$temp_array[1] = $i;
					$temp_array[2] = $section["title"];
					$temp_array[3] = $section["content"];
					$stmtTestAdd->execute();
					$stmtTestAdd->close();
					$i++;
				}
			}
			//$stmtGetPage->close();
			$response->status = "Success id = {$pageId} pageTitle = {$pageTitle}";
		
		}
		$conn->close();
		echo json_encode($response);
		exit();
	}

#{
#        "page_title" : "add_page_test",
#  		"editor_id" : "666",
#  		"sections" : [ {"title" : "First Section", "content" : "Stuff about the first section for this test section, this is a test."},
#                      {"title" : "Second Section", "content" : "Second Section stuff, I would explain stuff here, more deatails},
#                      {"title" : "Third Section", "content" : "Stuff Third Section, More stuff"}
#                     ]
#}
?>
