/**
 * Strem data handle
 */

var app = null;

function Quote(/*Decimal*/price, /*Integer*/size) {
	this.price = price;
	this.size = size;
}

Quote.prototype.getPrice = function() {
	return this.price;
}

Quote.prototype.getSize = function() {
	return this.size;
}


function MDEntry(/*String*/symbol) {
	this.symbol = symbol;
	this.asks = [];
	this.bids = [];
}

MDEntry.prototype.getSymbol = function() {
	return this.symbol;
}

MDEntry.prototype.getBid = function(/*Integer*/index) {
	return index >= 0 && index < this.bids.length ? this.bids[index] : null;
}

MDEntry.prototype.getAsk = function(/*Integer*/index) {
	return index >= 0 && index < this.asks.length ? this.asks[index] : null;
}

MDEntry.prototype.getBidPrice = function(/*Integer*/index) {
	var quote = this.getBid(index);
	return quote == null ? null : quote.getPrice();
}

MDEntry.prototype.getBidSize = function(/*Integer*/index) {
	var quote = this.getBid(index);
	return quote == null ? null : quote.getSize();
}

MDEntry.prototype.getAskPrice = function(/*Integer*/index) {
	var quote = this.getAsk(index);
	return quote == null ? null : quote.getPrice();
}

MDEntry.prototype.getAskSize = function(/*Integer*/index) {
	var quote = this.getAsk(index);
	return quote == null ? null : quote.getSize();
}

MDEntry.prototype.addAsk = function(/*Quote*/quote) {
	this.asks.push(quote);
}

MDEntry.prototype.addBid = function(/*Quote*/quote) {
	this.bids.push(quote);
}


function MDTableModel() {
	this.entries = [];
	this.symbol2index = {};
	this.timestamp = null;
}

MDTableModel.prototype.getTimestamp = function() {
	return this.timestamp;
}

MDTableModel.prototype.setTimestamp = function(/*String*/timestamp) {
	this.timestamp = timestamp;
}

MDTableModel.prototype.updateEntry = function(/*MDEntry*/entry) {
	var symbol = entry.getSymbol();
	if (symbol in this.symbol2index) {
		var index = this.symbol2index[symbol];
		this.entries[index] = entry;
	} else {
		var index = this.entries.length;
		this.entries.push(entry); 
		this.symbol2index[symbol] = index;
	}
}

MDTableModel.prototype.getEntryCount = function() {
	return this.entries.length;
}

MDTableModel.prototype.getEntryByIndex = function(/*Index*/index) {
	if ( index < 0 || index >= this.getEntryCount() ) {
		throw new Error(index, "Index out of range");
	}
	return this.entries[index];
}


function MDTableRow(/*Integer*/index) {
	this.entry = null;
	this.index = index;
	this.tr = document.createElement("tr");
	this.td_symbol = this.addCell("left");
	this.td_bidSize2 = this.addCell();
	this.td_bidSize1 = this.addCell();
	this.td_bidSize0 = this.addCell();
	this.td_bidPrice0 = this.addCell();
	this.td_askPrice0 = this.addCell();
	this.td_askSize0 = this.addCell();
	this.td_askSize1 = this.addCell();
	this.td_askSize2 = this.addCell();
}

MDTableRow.prototype.addCell = function(/*String*/cssClassName) {
	var cell = document.createElement("td");
	if ( typeof cssClassName !== "undefined" ) {
		cell.className = cssClassName;
	}
	this.tr.appendChild(cell);
	return cell;
}

MDTableRow.prototype.getRowElement = function() {
	return this.tr;
}

MDTableRow.prototype.getIndex = function() {
	return this.index;
}

MDTableRow.prototype.getEntry = function() {
	return this.entry;
}

MDTableRow.prototype.update = function(/*MDEntry*/entry) {
	if ( typeof(entry) == "undefined" ) {
		throw new Error(this.index, "Illegal argument exception");
	}
	this.entry = entry;
	this.setCellText(this.td_symbol, entry.getSymbol());
	this.setCellText(this.td_bidSize2, entry.getBidSize(2));
	this.setCellText(this.td_bidSize1, entry.getBidSize(1));
	this.setCellText(this.td_bidSize0, entry.getBidSize(0));
	this.setCellText(this.td_bidPrice0, entry.getBidPrice(0));
	this.setCellText(this.td_askPrice0, entry.getAskPrice(0));
	this.setCellText(this.td_askSize0, entry.getAskSize(0));
	this.setCellText(this.td_askSize1, entry.getAskSize(1));
	this.setCellText(this.td_askSize2, entry.getAskSize(2));
}

MDTableRow.prototype.setCellText = function(/*DOMElement*/td_cell, /*String*/text) {
	td_cell.innerHTML = (text == null ? "" : text);
}


function MDTable(/*DOMElement*/rootElement) {
	this.rootElement = rootElement;
	this.rows = [];
	for ( var i = 0; i < 10; i ++ ) {
		this.addEmptyRow();
	}
}

MDTable.prototype.getRowCount = function() {
	return this.rows.length;
}

MDTable.prototype.addEmptyRow = function() {
	var index = this.getRowCount();
	var row = new MDTableRow(index);
	this.rows[index] = row;
	this.clearRow(index);
	this.rootElement.appendChild(row.getRowElement());
	return row;
}

MDTable.prototype.getRow = function(/*Index*/index) {
	if ( index < 0 || index >= this.getRowCount() ) {
		throw new Error(index, "Row index out of range");
	}
	return this.rows[index];
}

MDTable.prototype.clearRow = function(/*Index*/index) {
	this.getRow(index).update(new MDEntry(null));
}

MDTable.prototype.updateRow = function(/*Integer*/index, /*MDEntry*/entry) {
	this.getRow(index).update(entry);
}

function MDApp() {
	this.tableModel = new MDTableModel();
	this.tableView = new MDTable(document.getElementById("market_body"));
	this.timerID = null;
	this.delay = 500;
	this.pageNumber = 0;
}

MDApp.prototype.start = function() {
	this.sendMarketDataRequest();
}

MDApp.prototype.onTimerTick = function() {
	this.sendMarketDataRequest();
}

MDApp.prototype.outputTimeStamp = function(timestamp) {
	document.getElementById("timestamp").innerHTML = timestamp.split(".")[0];
}

MDApp.prototype.onMarketDepthData = function(/*Object*/response) {
	if ( response.error == 1 ) {
		alert("API error: " + response.error_message);
	} else {
		var timestamp = response.timestamp;
		var data = response.data;		
		if ( timestamp != null ) {
			this.tableModel.setTimestamp(timestamp);
			this.outputTimeStamp(timestamp);
		}
		for ( var i = 0; i < data.length; i ++ ) {
			var x = data[i];
			var entry = new MDEntry(x['sym']);
			var asks = x['ask'];
			var bids = x['bid'];
			for ( var j = 0; j < asks.length; j ++ ) {
				entry.addAsk(new Quote(asks[j][0], asks[j][1]));
			}
			for ( var j = 0; j < bids.length; j ++ ) {
				entry.addBid(new Quote(bids[j][0], bids[j][1]));
			}
			this.tableModel.updateEntry(entry);
		}
	}
	this.refreshTableView();
	var object = this;
	this.timeID = setTimeout(function() { object.onTimerTick(); }, this.delay );
}

MDApp.prototype.onError = function(/*String*/textStatus) {
	alert("Cannot load table data: " + textStatus);
}

MDApp.prototype.sendMarketDataRequest = function() {
	var object = this;
	var params = {};
	var timestamp = this.tableModel.getTimestamp();
	if ( timestamp != null ) {
		params['timestamp'] = timestamp;
	}
	$.ajax({                                      
		url: 'api.php',
		data: params,
		type: "GET",
		dataType: 'json',
		success: function(response) {
			object.onMarketDepthData(response)
		},
		error: function(jqXHR, textStatus, errorThrown) {
			object.onError(textStatus);
		}
	});
}

MDApp.prototype.getTotalPages = function() {
	var entryCount = this.tableModel.getEntryCount();
	var rowCount = this.tableView.getRowCount();
	if ( rowCount == 0 || entryCount == 0 ) {
		return 1;
	}
	var pages = Math.floor(entryCount / rowCount);
	if ( entryCount % rowCount != 0 ) {
		pages ++;
	}
}

MDApp.prototype.refreshTableView = function() {
	var entryCount = this.tableModel.getEntryCount();
	var rowCount = this.tableView.getRowCount();
	var startIndex = this.pageNumber * rowCount;
	for ( var i = 0; i < rowCount; i ++ ) {
		var entryIndex = startIndex + i;
		if ( entryIndex >= entryCount ) {
			this.tableView.clearRow(i);
		} else {
			var entry = this.tableModel.getEntryByIndex(entryIndex);
			this.tableView.updateRow(i, entry);
		}
	}
	var dummy = document.getElementById("timestamp");
	if ( dummy && this.tableModel.getTimestamp() ) {
		dummy.innerHTML = this.tableModel.getTimestamp();
	}
}

MDApp.prototype.nextPage = function() {
	this.pageNumber ++;
	var total = this.getTotalPages();
	if( this.pageNumber >= total ) {
		this.pageNumber = total - 1;
	}
	this.refreshTableView();
}

MDApp.prototype.prevPage = function() {
	this.pageNumber --;
	if ( this.pageNumber < 0 ) {
		this.pageNumber = 0;
	}
	this.refreshTableView();
}

function MDAppLoad() {
	app = new MDApp();
	app.start();
}

function Next() {
	app.nextPage();

}

function Previous() {
	app.prevPage();
}
