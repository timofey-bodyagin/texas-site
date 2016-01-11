
<?php 

  require_once 'config.php';
  include 'phplib/parser.php';
  include 'phplib/updater.php';
  error_reporting(-1) ;
  ini_set('display_errors', 'On'); 

  //--------------------------------------------------------------------------
  // 1) Connect to mysql database using mysqli
  //--------------------------------------------------------------------------
  
    $mysqli = new mysqli($host,$user,$pass,$databaseName);

    if (mysqli_connect_error()) {
    die('Connection error: (' . mysqli_connect_errno() . ') '
            . mysqli_connect_error());
    }
  //--------------------------------------------------------------------------
  // 2) Query database for data
  //--------------------------------------------------------------------------
    $result = mysqli_query($mysqli, "SELECT * FROM $tableName");          //query

    $row_cnt = $result->num_rows;
  // if we have rusults
  if($row_cnt != 0) {
  //--------------------------------------------------------------------------
  // 3) echo result as json 
  //--------------------------------------------------------------------------
  $product = parse($result);
  }
  else {    //if rusult is empty we fill empty data

    for($c=0; $c < 109 ; $c++) {
  
       $product[$c] = array("No data", "0", "0", "0", "0", "0", "0", "0", "0");


     }
  }
    

  
 
    mysqli_free_result($result);
    mysqli_close($mysqli); 
    echo json_encode($product);
?>