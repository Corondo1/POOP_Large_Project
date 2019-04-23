<?php
	include("config.php");
	try_session();
	
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		
		
		$conn = getDatabase();
		
		$response = new \stdClass();
		if(mysqli_connect_errno($conn))
		{
			$response->state = 0; // Error
		}
		else
		{
			if(!isset($_SESSION['access']))
			{
				$_SESSION['access'] = 0;
			}
			$stmt = $conn->prepare("SELECT title, id, description, access, team FROM Pages WHERE access <= ? AND access < 2");
			$stmt->bind_param("i", $_SESSION['access']);
			$stmt->execute();
			
			$stmt->bind_result($title, $id, $description, $access, $team);
			$stmt->store_result();
			
			if($stmt->num_rows() < 1)
			{
				$response->state = 0; // "Nothing Found";
			}
			else
			{
				$response->pages = array(array());
				$i = 0;
				while($stmt->fetch())
				{
					$response->pages[$i] = new \stdClass();
					$response->pages[$i]->id = $id;
					$response->pages[$i]->title = $title;
					$response->pages[$i]->description = $description;
					$response->pages[$i]->access = $access;
					$response->pages[$i]->team = $team;
					$i++;
				}
				
			}
		}
		
		echo json_encode($response);
		exit();
		
	}


?>