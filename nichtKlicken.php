<?php
	$con = mysqli_connect("localhost", "root", "", "sensSEH");
    if( !$con ) die("Error connecting to the Database: ".mysqli_connect_error() );
    $dataCount = 0;
    $time = strtotime('2006-01-01 00:00:00');


    for($dataCount=0;$dataCount<=350400;$dataCount++) {
    	$q = "INSERT INTO sensData (time, sensID, temp, hum) VALUES ('".date("Y-m-d H:i:s", $time)."', 2, ".
    	round((0.25/(15*(525600))*$dataCount+9)+12*sin(15*(1/(24*(60)))*2*pi()*$dataCount-pi()/2)+(9*sin(2*pi()*$dataCount*15*(1/(365*(24)*60))-pi()/2)), 1)
    	.", 0);";
    	$time += 60 * 15;
        if( !mysqli_query($con, $q) )
            die(ERR_Q . mysqli_error($con) );
    }
?>