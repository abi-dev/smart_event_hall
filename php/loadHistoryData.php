<?php

	$con = mysqli_connect("localhost", "root", "", "sensSEH");
    if( !$con ) die("Error connecting to the Database: ".mysqli_connect_error() );
    $groupBy = '';

    if($_POST['span'] == '0') {
    	$groupBy = ', month(time) div 4';
    } else if($_POST['span'] == '1') {
    	$groupBy = ', month(time)';
    } else if($_POST['span'] == '2') {
    	$groupBy = ', week(time)';
    } else if($_POST['span'] == '3') {
    	$groupBy = ', date(time)';
    } else if($_POST['span'] == '4') {
    	$groupBy = ', date(time), hour(time) div 4';
    } else if($_POST['span'] == '5') {
    	$groupBy = ', date(time), hour(time)';
    }

    $q = "select time, avg(temp) as avgTemp from sensData 
    where sensID = ".$_POST['curSel']." 
    and date(time) >= ".$_POST['startDate']." 
    group by year(time)".$groupBy." 
    limit 20";

    error_log($q);

	$res = mysqli_query($con, $q);
	if( !$res )	die("Query failed:".mysqli_error($con) );

	if( mysqli_num_rows($res) >0 )
	{
		$dataRead = array();
		while( $row = mysqli_fetch_assoc($res) )
		{
			$dataRead['time'] = $row['time'];
			$dataRead['avgTemp'] = $row['avgTemp'];
		}
	}

	echo json_encode($dataRead);
?>
