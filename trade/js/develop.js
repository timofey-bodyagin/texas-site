/**
 * Strem data handle
 */

var pager = null;
var stream = Array();


function TableObject() {
  
  this.table_page = 0;
  stream = new Array();
  for( i = 0; i < 108; i++) {
     stream[i] = [];
	 for( j = 0; j < 10; j++) {
		if(i < 10) stream[i][j] = '1xxxx';
		else stream[i][j] = '2xxxx';
		
	 }
  }
  for( i = 30; i < 50; i++) {
     stream[i] = [];
	 for( j = 0; j < 10; j++) {
		
		stream[i][j] = '5xxxx';
		
	 }
  }
  pager = this;	
}

TableObject.prototype.refresh = function() {

var table=document.getElementById("market");

  for( i = 1; i <= 10; i++) {
     
     for( j = 0; j < 9; j++) {
     d = this.table_page*10 +i;
     if(j==4 || j ==5) { table.rows[i].cells.item(j).innerHTML = (parseFloat(stream[d][j])).toFixed(2); }
     else {
     table.rows[i].cells.item(j).innerHTML = stream[d][j];
    

 };

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
        for( i = 0; i < 107; i++) {
        
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
	if(this.table_page > 9) this.table_page = 9;
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