<?php
	include("config.php");
	//session_start();
	//$_SESSION = array();
	$obj = json_decode(file_get_contents('php://input'), true);
    //var_dump(obj);
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
	    
		$usernameInput = $obj["username"];
		$passwordInput = $obj["password"];
    
		$conn = getDataBase();
		
		$response = new \stdClass();
		// Bad Connection to the DB
		if(mysqli_connect_errno($conn))
		{
			echo("Failed to connect to MySQL: " . mysqli_connect_error($conn));
		} 
		// Successful connection to DB
		else
		{			
			$stmt = $conn->prepare("SELECT name, password FROM Users WHERE name = ?");
			
			$stmt->bind_param("s", $usernameInput);
			
			$stmt->execute();
						
			$stmt->bind_result($usernameDB, $passwordDB);
			$stmt->store_result();
			
			// Username doesn't exist
			if ($stmt->num_rows() < 1)
			{
			    $response->username = $usernameDB;
			    $response->password = $passwordDB;
			    $response->state = "Incorrect Username";
			}
			else
			{
				while ($stmt->fetch())
				{
				    // Correct password
					if (password_verify($passwordInput, $passwordDB))
					{
        			    //$response->username = $usernameDB;
        			    //$response->password = $passwordDB;
        			    $response->state = "Success";
        			    
						//$_SESSION['login_user'] = $usernameDB;
					}
					else		// Incorrect Password
					{
						// Send JSON response
        			    //$response->username = $usernameDB;
        			    //$response->password = $passwordDB;
        			    $response->state = "Incorrect Password.";
					}
				}
			}
			$stmt->close();
			$conn->close();
		}
		
		echo json_encode($response);
		exit();
	}
?>