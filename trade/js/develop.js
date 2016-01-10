/**
 * Strem data handle
 */

var pager = null;
var stream = Array();


function TableObject() {
  
  this.table_page = 0;
  stream = new Array();
  for( i = 0; i < 119; i++) {
     stream[i] = [];
	 for( j = 0; j < 10; j++) {
		if(i < 10) stream[i][j] = ' ';
		else stream[i][j] = ' ';
		
	 }
  }
  for( i = 30; i < 50; i++) {
     stream[i] = [];
	 for( j = 0; j < 10; j++) {
		
		stream[i][j] = ' ';
		
	 }
  }
  pager = this;	
}

TableObject.prototype.refresh = function() {

var table=document.getElementById("market");
document.getElementById("timestamp").innerHTML= stream[0][9];
  for( i = 0; i < 10; i++) {
     
     for( j = 0; j < 9; j++) {
     d = this.table_page*10 +i;
     if((j==4 || j ==5) && (stream[d][j] != ' ')) { 
     	
     	table.rows[i+1].cells.item(j).innerHTML = (parseFloat(stream[d][j])).toFixed(2); 
     }
     else {
     	
        table.rows[i+1].cells.item(j).innerHTML = stream[d][j];
        
     }


  }


}
}

TableObject.prototype.starttimer = function() {
	var object = this;
	this.timeID = setTimeout(function() { object.SendRequest(); }, 1500 );
	object.refresh();
}

TableObject.prototype.SendRequest = function() {
	var object = this;
	$.ajax({                                      
      url: 'api.php',                  //the script to call to get data          
      data: "",                        //you can insert url argumnets here to pass to api.php
                                       //for example "id=5&parent=6"
      dataType: 'json',                //data format      
      success: function(data) {
			
        var id = data[0][1];              //get id
        var vname = data[1][1];
        var size = data.length;
        for( i = 0; i < size; i++) {
        
	        for( j = 0; j < 10; j++) {
		
		        stream[i][j] = data[i][j];
		
	        }
        }
        object.refresh();
        object.starttimer();
		},
	  error: function(jqXHR, textStatus, errorThrown) {
			object.onTableDataError(textStatus);
		}
	});
}



TableObject.prototype.onTableDataError = function(/*String*/ textStatus) {
	alert("Cannot load table data: " + textStatus);
}


TableObject.prototype.getTablePage = function() {
	return this.table_page;
}

TableObject.prototype.NextTablePage = function() {
	this.table_page++;
	if(this.table_page > 10) this.table_page = 10;
	this.refresh();
}
TableObject.prototype.PrevTablePage = function() {
	this.table_page--;
	if(this.table_page < 0) this.table_page = 0;
	this.refresh();
}

function Next() {
	
	pager.NextTablePage();

}
function Previous() {
	pager.PrevTablePage();
}