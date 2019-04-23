<?php
	//apply admin
	include("config.php");
	try_session();
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$response = new \stdClass();
		
		if($_SESSION['isLoggedIn'])
		{
			if($_SESSION['access'] >= 3)
			{
				$response->state = 4; //user is already an admin
			}
			
			$id = $_SESSION['id'];
			
			$conn = getDataBase();
			if(mysqli_connect_errno($conn))
			{
				$response->state = 3;
			}
			else
			{
				$stmt = $conn->prepare("UPDATE Users Set access =? WHERE id = ?");
				$stmt->bind_param("ii", $a = 3, $id);
				
				if($stmt->execute())
				{
					$response->state = 1;
				}
				else
				{
					$response->state = 5;
				}
			}
			
		}
		else
		{
			$response->state = 2; //User is not logged in
		}
		
		echo json_encode($response);
		exit();
	}
	
?>