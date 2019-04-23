<?php
	include("config.php");
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$conn = getDataBase();
		
		$response = new \stdClass();
		if(mysqli_connect_errno($conn))
		{
			$response->text = "Mysqli connect error";
			$response->state = 2;
		}
		else
		{
			$response->page_title = "Page1";
			$response->page_information = "This is a description of page 1";
			$firstarray = array("index" => 1, "section_title" =>"Sections 1", "section_text" => "This is section 1" );
			$secondarray = array("index" => 2, "section_title" =>"Sections 2", "section_text" => "This is section 2 from php" );
			
			$response->sections = array();
			
			$response->sections[] = $firstarray;
			$response->sections[] = $secondarray;
		}
	}
	
	echo json_encode($response);
	exit();
?>