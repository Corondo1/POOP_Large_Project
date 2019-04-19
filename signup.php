<?php
	include("config.php");
	
	if($_SERVER["REQUEST_METHOD"] = "POST")
	{
		$obj = json_decode(file_get_contents('php://input'), true);
	
		$response = new \stdClass();
		$conn = getDataBase();
		
		
		//$username = $_POST['username'];
		//$password = $_POST['password']; 
		//$password_confirm = $_POST['password_confirm'];
		
		
		if(mysqli_connect_errno($conn))
		{
			$response->state = 3; //Error with mysqli
		}
		else
		{
			
			$username = $obj["username"];
			$password = $obj["password"];
			$authpassword = $obj["password_confirm"];
			if($password == $authpassword)
			{
				$hashed_password = password_hash($password, PASSWORD_DEFAULT);
			
				$stmt = $conn->prepare("INSERT INTO Users (name, password) VALUES (?,?)");
				$stmt->bind_param("ss", $username, $hashed_password);
				$stmt->execute();
			
				
				if(!($conn->insert_id == 0))
				{
					$response->state = 1;	//Success
				}
				else
				{
					$response->state = 0; //"Failure, Name Taken";
				}
			}
			else
			{
				$response->state = 2; //"Failure, Passwords do not match";
			}
		}
		echo json_encode($response);
		$conn->close();

		exit();
	}
	
	
?>