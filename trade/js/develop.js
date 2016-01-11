/**
 * Strem data handle
 */

var pager = null;
var entries = Array();

function DataEntry(symbol, bid2, bid1, bidSize, bidPrice, askPrice, askSize, ask1, ask2) {
	this.symbol = symbol;
	this.bid2 = bid2;
	this.bid1 = bid1;
	this.bidSize = bidSize;
	this.bidPrice = bidPrice;
	this.ask2 = ask2;
	this.ask1 = ask1;
	this.askSize = askSize;
	this.askPrice = askPrice;
	this.ss = "";
	
}

DataEntry.prototype.getSymbol = function() {
	return this.symbol;
}

DataEntry.prototype.getBid1 = function() {
	return this.bid1;
}

DataEntry.prototype.getBid2 = function() {
	return this.bid2;
}

DataEntry.prototype.getBidSize = function() {
	return this.bidSize;
}

DataEntry.prototype.getBidPrice = function() {
	return this.bidPrice;
}

DataEntry.prototype.getAsk1 = function() {
	return this.ask1;
}
DataEntry.prototype.getAsk2 = function() {
	return this.ask2;
}
DataEntry.prototype.getAskSize = function() {
	return this.askSize;
}
DataEntry.prototype.getAskPrice = function() {
	return this.askPrice;
}


function TableObject() {
  
  this.table_page = 0;
  this.entries = new Array();
  
  this.timestamp = '';
  
  
  pager = this;	
}
TableObject.prototype.updateEntryBySymbol = function(entry) {
	var index = this.getEntryIndexBySymbol(entry.symbol);
	var length = this.entries.length;
	if ( index < 0 ) {
		entries[length+1] = entry;
	}
	else {
		entries[index] = entry;
	}
	this.refresh();
}
TableObject.prototype.getEntryIndexBySymbol = function(/*String*/ symbol) {
	var length = this.entries.length;
	for ( var i = 0; i < length; i ++ ) {
		var entry = this.entries[i];
		if ( entry.symbol == symbol ) {
			return i;
		}
	}
	return -1;
}

TableObject.prototype.getEntryBySymbol = function(/*String*/symbol) {
	var index = this.getEntryIndexBySymbol(symbol);
	if ( index < 0 ) {
		throw "No symbol entry found: " + symbol;
	}
	return this.entries[index];
}



TableObject.prototype.refresh = function() {

var table = document.getElementById("market");
document.getElementById("timestamp").innerHTML= '';
 
for( i = 0; i < 10; i++) {
     
     for( j = 0; j < 9; j++) {
     d = this.table_page*10 +i;
     
     	if(this.entries == "undefined")
          {table.rows[i+1].cells.item(j).innerHTML = this.entries[d][j];}
      else 
      	{table.rows[i+1].cells.item(j).innerHTML = ' ';}
        
    


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
      data: "{2015-12-07 17:27:22.000}",                        //you can insert url argumnets here to pass to api.php
      type: "GET",                                 //for example "id=5&parent=6"
      dataType: 'json',                //data format      
      success: function(data) {
		var size = data.data.length;
		var ask2 = " ";
        var ask1 = " ";
        var askSize = " ";
        var askPrice = " ";

        var bid2 = " ";
        var bid1 = " ";
        
        var bidSize = " ";
        var bidPrice = " ";	

        for(var i =0; i < size; i++) {
        var sym = data.data[i].sym;
        var ask2 = data.data[i].ask[0][1];
        var ask1 = data.data[i].ask[1][1];
        if(typeof(data.data[i].ask[2]) !== "undefined" )  {
        var askSize = data.data[i].ask[2][1];
        var askPrice = data.data[i].ask[2][0];
        }

        var bid2 = data.data[i].bid[0][1];
        var bid1 = data.data[i].bid[1][1];
        if(data.data[i].bid[2] != null)  {
        var bidSize = data.data[i].bid[2][1];
        var bidPrice = data.data[i].bid[2][0];
    }
        var entry = new DataEntry(sym, bid1, bid2, bidSize, bidPrice, askPrice, askSize, ask1, ask2);
        var z = 1;
        updateEntryBySymbol(entry);
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