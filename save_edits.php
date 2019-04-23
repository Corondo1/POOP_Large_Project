<?php
	include("config.php");
	session_start();
	$_SESSION = array();
	$obj = json_decode(file_get_contents('php://input'), true);
	
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$conn = getDataBase();
		
		if(mysqli_connect_errno($conn))
		{
			//Fail state
		}
		else
		{
			$title = $obj["page_title"];  //index for pages shouldnt change
			$stmt = $conn->prepare("SELECT id FROM Pages WHERE title = ?");

			$stmt->bind_param("s", $title);
			$stmt->execute();
			
			$objSections = array();
			$objSections = $obj["sections"];
			
			
			if($stmt->num_rows() < 1)
			{
				//Error page does not exist
			}
			else
			{
				$objLength = count($objSections);
				//for every section: prepare and send an UPDATE Table query
				for($i = 0; i < $objLength; $i++)
				{
					$objvalue = $objSections[$i];
					$updated_index = $objvalue["index"];
					$updated_title = $objvalue["section_title"];
					$updated_text = $objvalue["section_txt"];
					
					//check database for ID of section
					$stmtUpdate = $conn->prepare("SELECT id FROM Sections WHERE id = ?");
					$stmtUpdate->bind_param("i", $index);
					$stmtUpdate->execute();

					if($stmtUpdate->num_rows() < 1)
					{
						//Section doesnt exist, cry, and yell at him
						$stmtUpdate->close();
						$stmt->close();
						$conn->close();
						return;
					}
					else
					{
						
						$stmtSendUpdate = $conn->prepare("UPDATE Sections SET heading = ?, content = ? WHERE id = ?");
						$stmtSendUpdate->bind_param("ssi" , $updated_title, $updated_text, $updated_index);
						$stmtSendUpdate->execute();
						
						$stmtSendUpdate->close();
					}
					
					$stmtUpdate->close();
				}
				$stmt->close();
				$conn->close();
			}
			
		}
		
		
		//check the index to make sure page exists
		
		//UPDATE "table" SET "column name = 'new value'" WHERE " stuff"
	}
?>