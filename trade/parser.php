 <?php

 function get_quote($str) {
 
    $q = explode("\n",$str);
    
    $q1 = '0';
    $q2 = 0;
    $q0 = 0;
    $qsize = 0;

    if(!empty($q)) {
       
       $len = count($q);
       switch($len) {

        case 1:
            if(trim($q[0]) != '') {
            $t = explode(",",$q[0]);
            $q0 = $t[1];
            $qsize = $t[0]; 
            }
            break;

        case 2:
           
            $t = explode(",",$q[0]);
            $q0 = $t[1];
            $qsize = $t[0];
            

            
            $t1 = explode(",",$q[1]);
            $q1 = $t1[1];
            break;
        default:

            $t = explode(",",$q[0]);
            $q0 = $t[1];
            $qsize = $t[0];

            $t1 = explode(",",$q[1]);
            $q1 = $t1[1];
        
            $t2 = explode(",",$q[2]);
            $q2 = $t2[1];
                   
          }
  


 }
 return array($q0,$q1,$q2,$qsize);
}

 function parse($result) {
   $i = 0;

  while($row = mysqli_fetch_array($result))
   {
    
    $sym = $row[0];
    $ts = explode(":",$row[3]);
    $ask = get_quote($row[1]);

    $bid = get_quote($row[2]);

    

    //echo "result: $sym    $ask2    $ask1  $ask0  $asksize  $bidsize  $bid0   $bid1  $bid2 \n";
    $product[$i][0] = $sym;
    $product[$i][1] = $bid[2];
    $product[$i][2] = $bid[1];
    $product[$i][3] = $bid[0];
    $product[$i][4] = $bid[3];
    $product[$i][5] = $ask[3];
    $product[$i][6] = $ask[0];
    $product[$i][7] = $ask[1];
    $product[$i][8] = $ask[2];
    $product[$i][9] = $ts[0].":".$ts[1];
   
    $i++;
    
   } 
return $product;

 }
   ?>
