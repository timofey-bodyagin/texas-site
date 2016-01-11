<?php 

  
  
  error_reporting(-1) ;
  ini_set('display_errors', 'On'); 

  //--------------------------------------------------------------------------
  // 1) Connect to mysql database using mysqli
  //--------------------------------------------------------------------------
  function ups() {
$host = "127.0.0.1";
    $user = "root";
    $pass = "Remcolor777";

    $databaseName = "spotquoting";
    $tableName = "Quotes";
    $mysqli = new mysqli($host,$user,$pass,$databaseName);

    if (mysqli_connect_error()) {
    die('Connection error: (' . mysqli_connect_errno() . ') '
            . mysqli_connect_error());
    }
  //--------------------------------------------------------------------------
  // 2) Query database for data
  //--------------------------------------------------------------------------
    $m1 = (string)(1540 + rand(10,20));
    echo "zzz=".$m1;
    $m2 = (string)(900 + rand(10,20));
    $st = "37.1600,450\n37.1800,1100\n37.1900,".$m1."\n37.2000,".$m2."\n37.2100,900\n37.2200,1400\n37.2300,900\n37.2400,800\n37.2500,1300\n37.2600,600";
    $sql = "UPDATE Quotes SET Asks=".$st." WHERE Symbol='AAl'";
    echo $sql;
    mysqli_query($mysqli, $sql);          //query
 
  //--------------------------------------------------------------------------
  // 3) echo result as json 
  //--------------------------------------------------------------------------
 
 


    
   
   mysqli_close($mysqli); 
  
}
?>