<?php
	include("config.php");
	session_save_path();
	try_session();
	$_SESSION = array();
	$obj = json_decode(file_get_contents('php://input'), true);
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
	    
		$usernameInput = $obj["username"];
		$passwordInput = $obj["password"];
    
		$conn = getDataBase();
		
		$response = new \stdClass();
		//$response->conn = $conn;
		// Bad Connection to the DB
		if(mysqli_connect_errno($conn))
		{
			$response->connect = "connect error";
		} 
		else
		{			
			$stmt = $conn->prepare("SELECT id, name, password, access FROM Users WHERE name = ?");
			$stmt->bind_param("s", $usernameInput);			
			$stmt->execute();
						
			$stmt->bind_result($id, $usernameDB, $passwordDB, $access);
			$stmt->store_result();
			
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
						$response->state = 1; //Success
        			    $response->access = $access;
						
						$_SESSION['isLoggedIn'] = true;
						$_SESSION['access'] = $access;
						$_SESSION['name'] = $usernameDB;
						$_SESSION['id'] = $id;
						
						//$response->sessionLogin = $_SESSION['isLoggedIn'];
						//$response->sessionAccess = $_SESSION['access'];

					}
					else		// Incorrect Password
					{
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
