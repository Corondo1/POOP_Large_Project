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
				$response->member_list = new \stdClass();
				$response->admin_list = new \stdClass();
				$response->page_list = new \stdClass();
				
				$response->member_list = admin_member_queue();
				$response->admin_list = admin_admin_queue();
				$response->page_list = admin_page_queue();
		}
		else
		{
			$response->state = 4;
		}
		}
		else
		{
			$response->state = 2; //user is not logged in
		}
		
		echo json_encode($response);
	}
	
	function admin_page_queue()
	{
		$conn = getDatabase();
		
		$response = new \stdClass();
		if(mysqli_connect_errno($conn))
		{
			$response->state = 3; // Error
		}
		else
		{
			$stmt = $conn->prepare("SELECT title, id, description, access FROM Pages WHERE access = 2");
			$stmt->execute();
			
			$stmt->bind_result($title, $id, $description, $access);
			$stmt->store_result();
			
			if($stmt->num_rows() < 1)
			{
				$response->state = 0; // "Nothing Found";
			}
			else
			{
				$response->pages = array();
				$i = 0;
				while($stmt->fetch())
				{
					$response->pages[$i] = new \stdClass();
					$response->pages[$i]->id = $id;
					$response->pages[$i]->title = $title;
					$response->pages[$i]->description = $description;
					$response->pages[$i]->access = $access;
					$i++;
				}
				$response->state = 1;
			}
		}
		
		return $response;
	}
	
	function admin_member_queue()
	{
		$conn = getDatabase();
		
		$response = new \stdClass();
		if(mysqli_connect_errno($conn))
		{
			$response->state = 3; // Error
		}
		else
		{
			$stmt = $conn->prepare("SELECT id, name FROM Users WHERE access = 1");
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