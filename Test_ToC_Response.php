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
			$response->page_title = "Table of Contents";
			$response->page_information = "This is a list of the pages available";
			$firstarray = array("index" => 1, "page_title" =>"Robohands are GARBAGE", "page_author" => "Robert Sherlock Holmes" );
			$secondarray = array("index" => 2, "page_title" =>"Dogs make great robots", "page_author" => "Will B. Buttlicker" );
            $thirdarray = array("index" => 3, "page_title" =>"Where to put your super suit", "page_author" => "Samuel L. Jackson" );

			$response->pages = array();

			$response->pages[] = $firstarray;
			$response->pages[] = $secondarray;
            $response->pages[] = $thirdarray;
		}
	}

	echo json_encode($response);
	exit();
?>
