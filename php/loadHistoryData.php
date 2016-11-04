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

    $q = "select distinct time, avg(temp) as avgTemp from sensData 
    where sensID = ".$_POST['curSel']." 
    and time >= \"".$_POST['startDate'].' 00:00:00'."\" 
    group by year(time)".$groupBy." 
    limit 20";

	$res = mysqli_query($con, $q);
	if( !$res )	die("Query failed:".mysqli_error($con) );

	if( mysqli_num_rows($res) >0 )
	{
		$dataRead = array();
        $dataRead['time'] = array();
        $dataRead['avgTemp'] = array();

        $dataID = 0;
		while( $row = mysqli_fetch_assoc($res) )
		{
            //$dataRead['time'][$dataID] = date('Y-m-d h:m:s', strtotime($row['time']));
            $dataRead['time'][$dataID] = $row['time'];
            $dataRead['avgTemp'][$dataID] = $row['avgTemp'];
            $dataID++;
		}
	}

    $stationDataRead = array();

    /* GET HISTORY DATA FOR EVERY STATION FOR SELECTED TIME */
    if($_POST['selDate'] != null) {

        $q = "select sensID, avgTemp, min(time) as time from
                (select sensID, time, avg(temp) as avgTemp from sensData where time >= \"".$_POST['selDate']."\" 
                    group by year(time)".$groupBy.", sensID) as avgData
                where time <= \"".date('Y-m-d h:m:s', strtotime($_POST['selDate'])+1)."\" group by sensID";

        $res = mysqli_query($con, $q);
        if( !$res ) die("Query failed:".mysqli_error($con) );

        if( mysqli_num_rows($res) >0 )
        {

            while( $row = mysqli_fetch_assoc($res) )
            {
                $stationDataRead[$row['sensID']] = $row['avgTemp'];
            }
        } else {
        }
    } else {
        $stationDataRead = null;
    }


    // get position data for 3Dhistory
    $q = "select sensID, posX, posY, posZ, hallID from sensInfo";

    $res = mysqli_query($con, $q);
    if( !$res ) die("Query failed:".mysqli_error($con) );

    if( mysqli_num_rows($res) >0 )
    {
        $posDataRead = array();

        while( $row = mysqli_fetch_assoc($res) )
        {
            $posDataRead[$row['sensID']] = array();
            $posDataRead[$row['sensID']] = [$row['posX'],$row['posY'],$row['posZ'], $row['hallID']];
        }
    } else {
    }

    

    $return = array();
    $return['dataRead'] = $dataRead;
    $return['stationDataRead'] = $stationDataRead;
    $return['posData'] = $posDataRead;
    $return['debug'] = $_POST['selDate'];

	echo json_encode($return);
?>
