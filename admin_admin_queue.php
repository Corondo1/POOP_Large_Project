<?php
	include("config.php");
	try_session();
	
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$response = new \stdClass();
		if($_SESSION['isLoggedIn'])
		{
			if($_SESSION['access'] > 3)
			{
				$response = admin_admin_queue();
			}
			else
			{
				$response->state = 4; //Access Denied
			}
		}
		else
		{
			$response->state = 2; //user is not logged in
		}
		
		echo json_encode($response);
	}
	
	function admin_admin_queue()
	{
		$conn = getDatabase();
		
		$response = new \stdClass();
		if(mysqli_connect_errno($conn))
		{
			$response->state = 3; // Error
		}
		else
		{
			$stmt = $conn->prepare("SELECT id, name FROM Users WHERE access = 3");
			$stmt->execute();
			
			$stmt->bind_result($id, $name);
			$stmt->store_result();
			
			if($stmt->num_rows() < 1)
			{
				$response->state = 0; // "Nothing Found";
			}
			else
			{
				$response->members = array(array());
				$i = 0;
				while($stmt->fetch())
				{
					$response->members[$i] = new \stdClass();
					$response->members[$i]->id = $id;
					$response->members[$i]->name = $name;
					$i++;
				}
				
			}
		}
		return $response;
	}

?>