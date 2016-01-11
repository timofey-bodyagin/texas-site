#!/usr/local/bin/php -q
<?php

// skeleton for php server
error_reporting(E_ALL);

/* endless waiting */
set_time_limit(0);

/* Switch off input clearing
 * symbols appear as is */
ob_implicit_flush();

//$address = '192.168.1.53';
$address = '127.0.0.1';
$port = 10000;

if (($sock = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) === false) {
    echo "Cannot run socket_create(): reason: " . socket_strerror(socket_last_error()) . "\n";
}

if (socket_bind($sock, $address, $port) === false) {
    echo "Cannot done socket_bind(): reason: " . socket_strerror(socket_last_error($sock)) . "\n";
}

if (socket_listen($sock, 5) === false) {
    echo "Cannot done socket_listen(): reason: " . socket_strerror(socket_last_error($sock)) . "\n";
}

do {
    if (($msgsock = socket_accept($sock)) === false) {
        echo "Cannot done  socket_accept(): reason: " . socket_strerror(socket_last_error($sock)) . "\n";
        break;
    }
    /* Send instructions */
    $msg = "\nWelcome to test server PHP. \n" .
        "In order to close type 'quit'. Switch off server, type 'quiting'.\n";
    socket_write($msgsock, $msg, strlen($msg));

    do {
        if (false === ($buf = socket_read($msgsock, 2048, PHP_NORMAL_READ))) {
            echo "Cannot done socket_read(): reason: " . socket_strerror(socket_last_error($msgsock)) . "\n";
            break 2;
        }
        if (!$buf = trim($buf)) {
            continue;
        }
        if ($buf == 'quit') {
            break;
        }
        if ($buf == 'quiting') {
            socket_close($msgsock);
            break 2;
        }
        $talkback = "PHP: You xmlrpc_server_add_introspection_data(server, desc) '$buf'.\n";
        socket_write($msgsock, $talkback, strlen($talkback));
        echo "$buf\n";
    } while (true);
    socket_close($msgsock);
} while (true);

socket_close($sock);
?>
