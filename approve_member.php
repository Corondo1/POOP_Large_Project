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
			$memberId = $obj['member_id'];
			$access = $obj['access'];
			
			$stmt = $conn->prepare("SELECT * FROM Users WHERE id = ?");
			$stmt->bind_param("i", $memberId);
			$stmt->execute();
			$stmt->store_result();
			
			if($stmt->num_rows() < 1)
			{
				$response->state = 0; // Not found in database
			}
			else
			{
				$stmtApprove = $conn->prepare("UPDATE Users SET access = ? WHERE id = ?");
				$stmtApprove->bind_param("ii", $access, $memberId);
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