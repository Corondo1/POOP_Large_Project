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
				$response = approve_member();
			}
			else
			{
				$response->state = 4; //access denied
			}
		}
		else
		{
			$response->state = 2; //User is not logged in
		}
		
		echo json_encode($response);
		exit();
	}
	
	function approve_member()
	{
		$response = new \stdClass();
		$obj = json_decode(file_get_contents('php://input'), true);
		
		$conn = getDataBase();
		if(mysqli_connect_errno($conn))
		{
			$response->state = 3;
		}
		else
		{
			$member_name = $obj['member_name'];
			$access = $obj['access'];
			
			$stmt = $conn->prepare("SELECT * FROM Users WHERE name = ?");
			$stmt->bind_param("s", $member_name);
			$stmt->execute();
			$stmt->store_result();
			
			if($stmt->num_rows() < 1)
			{
				$response->state = 0; // Not found in database
			}
			else
			{
				$stmtApprove = $conn->prepare("UPDATE Users SET access = ? WHERE name = ?");
				$stmtApprove->bind_param("is", $access, $member_name);
				if($stmtApprove->execute())
				{
					$response->state = 1; // Success in approving page
				}
				else
				{
					$response->state = 4; // Something went wrong
				}
			}
		}
		
		return $response;
	}
?>