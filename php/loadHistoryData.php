<?php
	$con = mysqli_connect("localhost", "root", "", "sensSEH");
    if( !$con ) die("Error connecting to the Database: ".mysqli_connect_error() );

    $q = "select time, avg(temp) as avgTemp from sensData 
    where sensID = ".$_POST['curSel']."
    and date(time) >=".$_POST['startDate']."
    and date_sub(`time`, interval 4 hour)
    group by date(time), hour(time) div 4
    limit 20";


select time as Hour, count(*) as NumData, avg(temp) as AvgTemp from sensData where sensID="0" and date(time)>="2006-1-1" and date_sub(`time`, interval 4 hour) group by date(time), hour(time) div 4 limit 20;

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
