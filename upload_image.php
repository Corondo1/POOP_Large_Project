<?php
	include("config.php");
	try_session();
	
	
	$imagename = $_FILES['myimage']['name'];
	
	$imagetmp= addslashes(file_get_contents($_FILES['myimage']['tmp_name']));
	
	$response = new \stdClass();
	
	$insert_image = "INSERT INTO Sections (content, heading) VALUES('$imagetmp','$imagename')";
	echo json_encode($response);





/* weird boyce stuff
// Allowed origins to upload images
$accepted_origins = array("http://localhost", "http://107.161.82.130", "http://codexworld.com");

// Images upload path
$imageFolder = "images/";

reset($_FILES);
$temp = current($_FILES);
$response = new \stdClass();

$response->text = "activated the php";
$response->state = 1;
if (isset($_FILES['file'])) 
{
	$response->upload = $_FILES['file'];
    $file_name = $_FILES['file']['name'];
    $file_tmp = $_FILES['file']['tmp_name'];
    $file_type = $_FILES['file']['type'];
    $file_size = $_FILES['file']['size'];
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

    // echo "file_name: " . $file_name . "\nfile_tmp: ".$file_tmp."
    // file_type: ".$file_type."\nfile_size: ".$file_size."\nfile_ext: ".$file_ext;

    $upload_file = $file_name;
    if (move_uploaded_file($file_tmp, $upload_file)) {
        // echo "\nSuccessfully uploaded";
       
		$response->something = array('location' => $upload_file);

    } else {
        //echo json_encode(array('location' => $filetowrite));
        echo "\nFailure to upload";
    }
}

echo json_encode($response);
exit();
/*
if(is_uploaded_file($temp['tmp_name'])){
    // if(isset($_SERVER['HTTP_ORIGIN'])){
    //     // Same-origin requests won't set an origin. If the origin is set, it must be valid.
    //     if(in_array($_SERVER['HTTP_ORIGIN'], $accepted_origins)){
    //         header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    //     }else{
    //         header("HTTP/1.1 403 Origin Denied");
    //         return;
    //     }
    // }

    // Sanitize input
    if(preg_match("/([^\w\s\d\-_~,;:\[\]\(\).])|([\.]{2,})/", $temp['name'])){
        header("HTTP/1.1 400 Invalid file name.");
        return;
    }

    // Verify extension
    if(!in_array(strtolower(pathinfo($temp['name'], PATHINFO_EXTENSION)), array("gif", "jpg", "png"))){
        header("HTTP/1.1 400 Invalid extension.");
        return;
    }

    // Accept upload if there was no origin, or if it is an accepted origin
    $filetowrite = $imageFolder . $temp['name'];
    move_uploaded_file($temp['tmp_name'], $filetowrite);

    // Respond to the successful upload with JSON.
    echo json_encode(array('location' => $filetowrite));
} else {
    // Notify editor that the upload failed
    header("HTTP/1.1 500 Server Error");
}
*/
?>
