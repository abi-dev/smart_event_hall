<?php
	$con = mysqli_connect("localhost", "root", "", "sensSEH");
    if( !$con ) die("Error connecting to the Database: ".mysqli_connect_error() );

	$q = "UPDATE sensInfo SET posX =".$_POST['posX'].", posY =".$_POST['posY'].", posZ =".$_POST['posZ']." WHERE sensID =".$_POST['curSel'];
	mysqli_query($con, $q);
	return json_encode(array("status" => true, "added" => true));
?>
