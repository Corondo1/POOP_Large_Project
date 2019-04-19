<?php
	include("config.php");
	try_session();
	/*
	$ok = session_start();
	if(!$ok)
	{
		session_regenerate_id(true); // replace the Session ID
		session_start(); 
	}
	*/
	$_SESSION = array();
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
			$stmt = $conn->prepare("SELECT name, password, access FROM Users WHERE name = ?");
			
			$stmt->bind_param("s", $usernameInput);
			
			$stmt->execute();
						
			$stmt->bind_result($usernameDB, $passwordDB, $access);
			$stmt->store_result();
			
			// Username doesn't exist
			//$response->numrow = $stmt->num_rows();
			if ($stmt->num_rows() < 1)
			{
				$response->state = 0;  //Fail username not found
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
        			    
						$response->state = 1; //Success
        			    
						$_SESSION['isLoggedIn'] = true;
						$_SESSION['access'] = $access;
						
						//$response->sessionLogin = $_SESSION['isLoggedIn'];
						//$response->sessionAccess = $_SESSION['access'];

					}
					else		// Incorrect Password
					{
						// Send JSON response
        			    //$response->username = $usernameDB;
        			    //$response->password = $passwordDB;
							
						$response->state = 2; //Inccorrect password
					}
				}
			}
			$conn->close();
		}
		
		echo json_encode($response);
		exit();
	}
?>
