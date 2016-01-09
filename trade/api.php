

<?php 

  //--------------------------------------------------------------------------
  // Example php script for fetching data from mysql database
  //--------------------------------------------------------------------------
    $host = "127.0.0.1";
    $user = "root";
    $pass = "Remcolor777";

    $databaseName = "spotquoting";
    $tableName = "Quotes";
  //--------------------------------------------------------------------------
  // 1) Connect to mysql database
  //--------------------------------------------------------------------------
    //include 'DB.php';
    $con = mysqli_connect($host,$user,$pass,$databaseName);
    
  //--------------------------------------------------------------------------
  // 2) Query database for data
  //--------------------------------------------------------------------------
    $result = mysqli_query($con, "SELECT * FROM $tableName");          //query
 // $array = mysql_fetch_row($result);                          //fetch result    

  //--------------------------------------------------------------------------
  // 3) echo result as json 
  //--------------------------------------------------------------------------
    $i = 0;
  while($row = mysqli_fetch_array($result))
   {
    $tim = "111";
    $sym = $row[0];
    
    // calculate ask
    $ask = explode("\n",$row[1]);

    $ask1 = 0;
    $ask2 = 0;
    $ask0 = 0;
    $asksize = 0;

    if(!empty($ask)) {
       
       $len = count($ask);
          if($len >= 3) {
            $t = explode(",",$ask[0]);
            $ask0 = $t[1];
            $asksize = $t[0];

            $t1 = explode(",",$ask[1]);
            $ask1 = $t1[1];
        
            $t2 = explode(",",$ask[2]);
            $ask2 = $t2[1];
        
          }
          else
            if($len >= 2) {
            $t = explode(",",$ask[0]);
            $ask0 = $t[1];
            $asksize = $t[0];

            $t1 = explode(",",$ask[1]);
            $ask1 = $t1[1];
        
                   
          }
          else 
            if($len >= 1) {
            $t = explode(",",$ask[0]);
            $ask0 = $t[1];
            $asksize = $t[0];

                   
          }
    }

    $bid = explode("\n",$row[2]);

    $bid1 = 0;
    $bid2 = 0;
    $bid0 = 0;
    $bidize = 0;

    if(!empty($bid)) {
       
       $len = count($bid);
          if($len >= 3) {
            $t = explode(",",$bid[0]);
            $bid0 = $t[1];
            $bidsize = $t[0];

            $t1 = explode(",",$bid[1]);
            $bid1 = $t1[1];
        
            $t2 = explode(",",$bid[2]);
            $bid2 = $t2[1];
        
          }
          else
            if($len >= 2) {
            $t = explode(",",$bid[0]);
            $bid0 = $t[1];
            $bidsize = $t[0];

            $t1 = explode(",",$bid[1]);
            $bid = $t1[1];
        
                   
          }
          else 
            if($len >= 1) {
            $t = explode(",",$bid[0]);
            $bid0 = $t[1];
            $bidsize = $t[0];

                   
          }
    }  

    //echo "result: $sym    $ask2    $ask1  $ask0  $asksize  $bidsize  $bid0   $bid1  $bid2 \n";
    $product[$i][0] = $sym;
    $product[$i][1] = $bid2 + rand(1,12);
    $product[$i][2] = $bid1;
    $product[$i][3] = $bid0;
    $product[$i][4] = $bidsize;
    $product[$i][5] = $asksize;
    $product[$i][6] = $ask0;
    $product[$i][7] = $ask1;
    $product[$i][8] = $ask2;
    $product[$i][9] = 0;
    $i++;
   } 
//  for ($i = 0; $i < 100; $i++)
//  {
//    for ($j=0; $j < 100; $j++)
 //   {
 //      $products[$i][$j] = rand(5,15) +$i*$j;
 //   }
    
 // } 
//  $products = array(
    // product abbreviation, product name, unit price
 //   array('choc_cake', 'Chocolate Cake', 15),
 //   array('carrot_cake', 'Carrot Cake', 12),
  //  array('cheese_cake', 'Cheese Cake', 20),
 //   array('banana_bread', 'Banana Bread', 14)
//);
    mysqli_free_result($result);
   mysqli_close($con); 
  echo json_encode($product);
?>