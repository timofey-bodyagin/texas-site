<?php

require_once 'config.php';
error_reporting(E_ALL);
ini_set('display_errors', DEBUG ? true : false);

class MDEntry {
	private $Symbol;
	private $Asks;
	private $Bids;
	private $Timestamp;

	public function getSymbol() {
		return $this->Symbol;
	}
	
	public function getAsksAsArray($maxLevels) {
		return $this->parseQuotes($this->Asks, $maxLevels);
	}
	
	public function getBidsAsArray($maxLevels) {
		return $this->parseQuotes($this->Bids, $maxLevels);
	}
	
	public function getTimestamp() {
		return $this->Timestamp;
	}
	
	private function parseQuotes($plainText, $maxLevels) {
		$quotes = array();
		$plainText = trim($plainText);
		foreach ( explode("\n", $plainText) as $line ) {
			$line = trim($line);
			if ( strlen($line) > 0 ) {
				$dummy = explode(",", trim($line));
				if ( sizeof($dummy) != 2 ) {
					throw new Exception("Quote data corrupted: " . $this->Symbol);
				}
				$quotes[] = array(sprintf("%0.2f", $dummy[0]), $dummy[1]);
				if ( sizeof($quotes) >= $maxLevels ) {
					break;
				}
			}
		}
		return $quotes;
	}
	
}
try {
	echo json_encode(main(), DEBUG ? JSON_PRETTY_PRINT : 0);
} catch ( Exception $e ) {
	echo json_encode(error_response('Unhandled exception [M]: ' . $e->getMessage()));
}

function error_response($message) {
	return array(
		'error' => 1,
		'error_message' => $message,
		'timestamp' => null,
		'data' => array(),
	);
}

function main() {
	try {
		$dbh = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME,
				DB_USER, DB_PASS, array(PDO::ATTR_PERSISTENT => true));
		$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	} catch ( PDOException $e ) {
		return error_response('Database error [C]: ' . $e->getMessage());
	}
	
	if ( isset($_GET['timestamp']) ) {
		$sth = $dbh->prepare('SELECT * FROM `Quotes` WHERE `Timestamp` > ?');
		$sth->execute(array($_GET['timestamp']));
	} else {
		$sth = $dbh->prepare('SELECT * FROM `Quotes`');
		$sth->execute();
	}
	$sth->setFetchMode(PDO::FETCH_CLASS, 'MDEntry');
	$timestamp = null;
	$data = array();
	while ( $entry = $sth->fetch() ) {
		if ( $timestamp === null || strcmp($timestamp, $entry->getTimestamp()) < 0 ) {
			$timestamp = $entry->getTimestamp();
		}
		$data[] = array(
			'sym' => $entry->getSymbol(),
			'ask' => $entry->getAsksAsArray(3),
			'bid' => $entry->getBidsAsArray(3)
		);
	}
	return array(
		'error' => 0,
		'error_message' => '',
		'timestamp' => $timestamp,
		'data' => $data,
	);
}
