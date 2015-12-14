/**
 * Spot Quote Market sample.
 */

function SqmSampleEntry(symbol, name, bid, bidSize, ask, askSize) {
	this.symbol = symbol;
	this.name = name;
	this.bid = bid;
	this.bidSize = bidSize;
	this.ask = ask;
	this.askSize = askSize;
}

SqmSampleEntry.prototype.getSymbol = function() {
	return this.symbol;
}

SqmSampleEntry.prototype.getName = function() {
	return this.name;
}

SqmSampleEntry.prototype.getBid = function() {
	return this.bid;
}

SqmSampleEntry.prototype.getBidSize = function() {
	return this.bidSize;
}

SqmSampleEntry.prototype.getAsk = function() {
	return this.ask;
}

SqmSampleEntry.prototype.getAskSize = function() {
	return this.askSize;
}

function SqmSampleTableModel() {
	this.entries = new Array();
}

SqmSampleTableModel.prototype.getEntryIndexBySymbol = function(/*String*/symbol) {
	var length = this.entries.length;
	for ( var i = 0; i < length; i ++ ) {
		var entry = this.entries[i];
		if ( entry.symbol == symbol ) {
			return i;
		}
	}
	return -1;
}

SqmSampleTableModel.prototype.getEntryBySymbol = function(/*String*/symbol) {
	var index = this.getEntryIndexBySymbol(symbol);
	if ( index < 0 ) {
		throw "No symbol entry found: " + symbol;
	}
	return this.entries[index];
}

function SqmSampleTableRow(/*Integer*/index) {
	var cellClass = "sqm-main-table-row-cell ";
	var rightClass = "sqm-right ";
	var o_this = this;
	var onBidClick = function() { o_this.onBidClick(); }
	var onAskClick = function() { o_this.onAskClick(); }
	
	this.index = index;
	this.row = document.createElement("tr");
	this.row.className = "sqm-main-table-row";
	
	this.symbol = document.createElement("td");
	this.symbol.className = cellClass + "sqm-cell-symbol";
	this.row.appendChild(this.symbol);

	this.name = document.createElement("td");
	this.name.className = cellClass + "sqm-cell-name";
	this.row.appendChild(this.name);
	
	this.bid = document.createElement("td");
	this.bid.className = cellClass + rightClass + "sqm-cell-bid";
	this.bid.addEventListener("click", onBidClick)
	this.row.appendChild(this.bid);
	
	this.bidSize = document.createElement("td");
	this.bidSize.className = cellClass + rightClass + "sqm-cell-bid-size";
	this.bidSize.addEventListener("click", onBidClick)
	this.row.appendChild(this.bidSize);
	
	this.ask = document.createElement("td");
	this.ask.className = cellClass + rightClass + "sqm-cell-ask";
	this.ask.addEventListener("click", onAskClick);
	this.row.appendChild(this.ask);
	
	this.askSize = document.createElement("td");
	this.askSize.className = cellClass + rightClass + "sqm-cell-ask-size";
	this.askSize.addEventListener("click", onAskClick);
	this.row.appendChild(this.askSize);
	
	this.entry = null;
}

SqmSampleTableRow.prototype.showExecutionReport = function(/*SqmSampleEntry*/entry, /*Bool*/isBid) {
	var msg = msg;
	if ( isBid ) {
		msg = "<p><div>SOLD<br/>" + entry.getBidSize() + " " + entry.getSymbol() +
			" Shares<br/>" + entry.getBid() + "</div></p>";
	} else {
		msg = "<p><div>BOUGHT<br/>" + entry.getAskSize() + " " + entry.getSymbol() +
			" Shares</br>" + entry.getAsk() + "</div></p>";
	}
	document.getElementById("dialog-report-text").innerHTML = msg;
	$(function() {
	    $( "#dialog-report" ).dialog({
	    	resizable: false,
	    	height:250,
	    	modal: true,
	    	buttons: {
	    		OK: function() {
	    			$( this ).dialog( "close" );
	    		},
	    	}
	    });
	});	
}

SqmSampleTableRow.prototype.onBidClick = function() {
	if ( typeof(this.entry) == "undefined" ) {
		return;
	}
	this.showExecutionReport(this.entry, true);
}

SqmSampleTableRow.prototype.onAskClick = function() {
	if ( typeof(this.entry) == "undefined" ) {
		return;
	}
	this.showExecutionReport(this.entry, false);
}

SqmSampleTableRow.prototype.getRowElement = function() {
	return this.row;
}

SqmSampleTableRow.prototype.update = function(/*SqmSampleEntry*/entry) {
	if ( typeof(entry) == "undefined" ) {
		throw "An entry object is required to create table row";
	}
	this.entry = entry;
	this.symbol.innerHTML = entry.getSymbol();
	this.name.innerHTML = entry.getName();
	this.bid.innerHTML = entry.getBid();
	this.bidSize.innerHTML = entry.getBidSize();
	this.ask.innerHTML = entry.getAsk();
	this.askSize.innerHTML = entry.getAskSize();
}

SqmSampleTableRow.prototype.getIndex = function() {
	return this.index;
}

SqmSampleTableRow.prototype.getEntry = function() {
	return this.entry;
}

function SqmSampleTable(/*Element*/ rootElement) {
	this.rootElement = rootElement;
	this.rows = new Array();
}

SqmSampleTable.prototype.getRowCount = function() {
	return this.rows.length;
}

SqmSampleTable.prototype.getRow = function(/*Integer*/ index) {
	if ( index < 0 || index >= this.getRowCount() ) {
		throw "Index out of range: " + index;
	}
	return this.rows[index];
}

/**
 * Private.
 * Create and append new row to the data table.
 * Don't use this method to manage table rows.
 * Use updateRow method instead.
 */
SqmSampleTable.prototype.createRow = function(/*SqmSampleEntry*/entry) {
	var index = this.getRowCount();
	var row = new SqmSampleTableRow(index);
	this.rows[index] = row;
	row.update(entry);
	this.rootElement.appendChild(row.getRowElement());
	return row;
}

SqmSampleTable.prototype.updateRow = function(/*Integer*/ rowIndex, /*SqmSampleEntry*/entry) {
	if ( rowIndex >= this.getRowCount() ) {
		this.createRow(entry);
	} else {
		this.getRow(rowIndex).update(entry);
	}
}

/**
 * Add entry to the table model.
 * Returns true if an entry has been appended or false if an entry overrides existing entry.
 */
//SqmSampleTable.prototype.addEntry = function(/*SqmSampleEntry*/entry) {
//	var index = this.getEntryIndexBySymbol(entry.symbol);
//	if ( index >= 0 ) {
//		this.entries[index] = entry;
//		return false;
//	} else {
//		this.entries[this.entries.length] = entry;
//		return true;
//	}
//}

/**
 * Top-level facade class.
 */
function SqmSample() {
	this.tableModel = new SqmSampleTableModel();
	this.table = new SqmSampleTable(document.getElementById("sqm_table_body"));
	this.nameCache = new Object();
	this.timerID = null;
	this.delay = 500;
	this.currentSnapshotNumber = 0;
	this.csvSeparatorChar = ",";
}

SqmSample.prototype.start = function() {
	var object = this;
	this.timeID = setTimeout(function() { object.onFirstTimerTick(); }, this.delay );
}

SqmSample.prototype.getSymbolName = function(symbol) {
	if ( this.nameCache.hasOwnProperty(symbol) ) {
		return this.nameCache[symbol];
	} else {
		return symbol;
	}
}

SqmSample.prototype.onFirstTimerTick = function() {	
	this.sendStockListDataRequest("nasdaq100list.csv");
}

SqmSample.prototype.onTimerTick = function() {
	this.sendTableDataRequest();
}

/**
 * This handler is for a csv which is already filtered by Sam's condition.
 */
SqmSample.prototype.onFilteredTableData = function(/*String*/text) {
	var array = $.csv.toArrays(text, { separator: this.csvSeparatorChar });
	var length = array.length;
	for ( var i = 0; i < length; i ++ ) {
		var x = array[i];
		// there are: symbol, bid, bid sz, bid $$$, ask, ask sz, ask $$$
		var entry = new SqmSampleEntry(x[0], this.getSymbolName(x[0]), x[1], x[2], x[4], x[5]);
		this.table.updateRow(i, entry);
	}
	var object = this;
	this.timeID = setTimeout(function() { object.onTimerTick(); }, this.delay );
}

/**
 * This handler is for a csv with last saved symbol state (service view of mdanalyzer).
 */
SqmSample.prototype.onServiceTableData = function(/*String*/text) {
	var array = $.csv.toArrays(text, { separator: this.csvSeparatorChar });
	var length = array.length;
	for ( var i = 0; i < length; i ++ ) {
		var x = array[i];
		// there are: symbol, bid, bid sz, bid-1, bid-1 sz, bid met, ask, ask sz, ask+1, ask+1 sz, ask met
		var entry = new SqmSampleEntry(x[0], this.getSymbolName(x[0]), x[1], x[2], x[6], x[7]);
		this.table.updateRow(i, entry);
	}
	var object = this;
	this.timeID = setTimeout(function() { object.onTimerTick(); }, this.delay );
}

SqmSample.prototype.onStockListData = function(/*String*/text) {
	var array = $.csv.toArrays(text, { separator: "," });
	var length = array.length;
	for ( var i = 1; i < length; i ++ ) {
		var x = array[i];
		// there are: Symbol, Name, lastsale, netchange,pctchange, share_volume, Nasdaq100_points
		this.nameCache[x[0]] = x[1];
	}
	this.sendTableDataRequest(); // Request table data immediately
}

SqmSample.prototype.onTableDataError = function(/*String*/textStatus) {
	alert("Cannot load table data: " + textStatus);
}

/**
 * Request for stock names.
 */
SqmSample.prototype.sendStockListDataRequest = function(/*String*/ url) {
	var object = this;
	$.ajax({
		url: url,
		type: "GET",
		dataType: "text",
		//async: false,
		success: function(data) {
			object.onStockListData(data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			object.onTableDataError(textStatus);
		}
	});
}

/**
 * Request data which is already filtered by Sam's condition
 * (when the next level quote size is greater than top quote size).
 * In THIS case you cannot get all 100 symbols of nasdaq 100 in the table.
 */
SqmSample.prototype.sendFilteredTableDataRequest = function(/*String*/ url) {
	var object = this;
	$.ajax({
		url: url,
		type: "GET",
		dataType: "text",
		success: function(data) {
			object.onFilteredTableData(data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			object.onTableDataError(textStatus);
		}
	});
}

/**
 * Request a raw service view of mdanalyzer.
 * In THIS case you cannot see a result of filtering by Sam's condition
 * but you can see all of 100 symbols in nasdaq 100.
 */
SqmSample.prototype.sendServiceTableDataRequest = function(/*String*/url) {
	var object = this;
	$.ajax({
		url: url,
		type: "GET",
		dataType: "text",
		success: function(data) {
			object.onServiceTableData(data);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			object.onTableDataError(textStatus);
		}
	});
}

SqmSample.prototype.sendTableDataRequest = function() {	
	this.currentSnapshotNumber ++;
	if ( this.currentSnapshotNumber > 120 ) {
		this.currentSnapshotNumber = 1;
	}
	var url = "snapshots/nasdaq100-mdanalyzer-service-view-auto-" + this.currentSnapshotNumber + ".csv";
	this.sendServiceTableDataRequest(url);
	// Examples: 
	//this.sendFilteredTableDataRequest("nasdaq100-mdanalyzer-main-view-1.csv");
	//this.sendServiceTableDataRequest("nasdaq100-mdanalyzer-service-view-1.csv");
}

function SqmOnAppLoad() {
	var sample = new SqmSample();
	sample.start();
}
