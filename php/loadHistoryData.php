<?php
	$con = mysqli_connect("localhost", "root", "", "sensSEH");
    if( !$con ) die("Error connecting to the Database: ".mysqli_connect_error() );

	$q = "select time, sensID, temp, hum from sensData;";
	$res = mysqli_query($con, $q);
	if( !$res )	die("Query failed:".mysqli_error($con) );

	if( mysqli_num_rows($res) >0 )
	{
		$dataRead = array();
		while( $row = mysqli_fetch_assoc($res) )
		{
			if( isset($dataRead[$row['sensID']])) {
				if(strtotime($row['time']) > $dataRead[$row['sensID']]['time'] ) {
					$dataRead[$row['sensID']]['time'] = strtotime($row['time']);
					$dataRead[$row['sensID']]['temp'] = $row['temp'];
					$dataRead[$row['sensID']]['hum'] = $row['hum'];
				} 
			} else {
				$dataRead[$row['sensID']] = array();
				$dataRead[$row['sensID']]['time'] = strtotime($row['time']);
				$dataRead[$row['sensID']]['temp'] = $row['temp'];
				$dataRead[$row['sensID']]['hum'] = $row['hum'];
			}
		}
	}

	$q = "select sensID, hallID, posX, posY, posZ from sensInfo;";
	$res = mysqli_query($con, $q);
	if( !$res )	die("Query failed:".mysqli_error($con) );

	if( mysqli_num_rows($res) >0 )
	{
		while( $row = mysqli_fetch_assoc($res) )
		{
			if(isset($dataRead[$row['sensID']])) {
					$dataRead[$row['sensID']]['hallID'] = $row['hallID'];
					$dataRead[$row['sensID']]['posX'] = $row['posX'];
					$dataRead[$row['sensID']]['posY'] = $row['posY'];
					$dataRead[$row['sensID']]['posZ'] = $row['posZ'];
			} else {
				$dataRead[$row['sensID']] = array();
				$dataRead[$row['sensID']]['hallID'] = $row['hallID'];
				$dataRead[$row['sensID']]['posX'] = $row['posX'];
				$dataRead[$row['sensID']]['posY'] = $row['posY'];
				$dataRead[$row['sensID']]['posZ'] = $row['posZ'];
			}
		}
	}
	$elemCount = count($dataRead);

	echo json_encode($dataRead);
?>
