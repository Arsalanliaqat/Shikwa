var mysql = require('mysql')
var config = require('../config/config');

// var connection = mysql.createConnection(config.database);

// connection.connect(function(error) {
//     if (error) {
//         console.log("DB connection faild: " + error);
//         return;
//     }

//     console.log("DB connection successfull");
// });

function handleDisconnect() {
    console.log(JSON.stringify(config.database));
    connection = mysql.createPool(config.database); // Recreate the connection, since
    // the old one cannot be reused.

    connection.on('connection', function(err) { // The server is either down
        if (err) { // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        } // to avoid a hot loop, and to allow our node script to

        console.log("DB connection successfull");
    }); // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else { // connnection idle timeout (the wait_timeout
            throw err; // server variable configures this)
        }
    });

    return connection;
}

module.exports = handleDisconnect();;