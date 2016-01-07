<?php 

  //--------------------------------------------------------------------------
  // Example php script for fetching data from mysql database
  //--------------------------------------------------------------------------
 // $host = "localhost";
 // $user = "root";
 // $pass = "root";

 // $databaseName = "ajax01";
 // $tableName = "variables";

  //--------------------------------------------------------------------------
  // 1) Connect to mysql database
  //--------------------------------------------------------------------------
 // include 'DB.php';
 // $con = mysql_connect($host,$user,$pass);
 // $dbs = mysql_select_db($databaseName, $con);

  //--------------------------------------------------------------------------
  // 2) Query database for data
  //--------------------------------------------------------------------------
 // $result = mysql_query("SELECT * FROM $tableName");          //query
 // $array = mysql_fetch_row($result);                          //fetch result    

  //--------------------------------------------------------------------------
  // 3) echo result as json 
  //--------------------------------------------------------------------------
  
  for ($i = 0; $i < 100; $i++)
  {
    for ($j=0; $j < 100; $j++)
    {
       $products[$i][$j] = rand(5,15) +$i*$j;
    }
    
  } 
//  $products = array(
    // product abbreviation, product name, unit price
 //   array('choc_cake', 'Chocolate Cake', 15),
 //   array('carrot_cake', 'Carrot Cake', 12),
  //  array('cheese_cake', 'Cheese Cake', 20),
 //   array('banana_bread', 'Banana Bread', 14)
//);
  echo json_encode($products);
?>