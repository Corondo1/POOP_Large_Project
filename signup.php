<?php
	include("config.php");
	
	if($_SERVER["REQUEST_METHOD"] = "POST")
	{
		$obj = json_decode(file_get_contents('php://input'), true);
	
		$response = new \stdClass();
		$conn = getDataBase();
		
		
		$username = $_POST['username'];
		$password = $_POST['password']; 
		$password_confirm = $_POST['password_confirm'];
		
		
		if(mysqli_connect_errno($conn))
		{
			$response->text = "Error";
		}
		else
		{
			
			$username = $obj["username"];
			$password = $obj["password"];
			$authpassword = $obj["password_confirm"];
			$hashed_password = password_hash($password, PASSWORD_DEFAULT);
			
			$stmt = $conn->prepare("INSERT INTO Users (name, password) VALUES (?,?)");
			$stmt->bind_param("ss", $username, $hashed_password);
			$stmt->execute();
			
			$stmt->store_result();
			if($stmt->num_rows() < 1)
			{
				$response->state = "Success";
			}
			else
			{
				$response->state = "Failure";
			}
		}
		
		$response->obj = new \stdClass();
		$response->obj = $obj;
		echo json_encode($response);
		$conn->close();
		//echo "<script>";
		//echo 'alert("$username is '. $username .' $password is '.$password.'  $password_confirm is '.$password_confirm.'");';
		//echo 'location = "login.html"';
		//echo "</script>";
		exit();
	}
	
	
?>