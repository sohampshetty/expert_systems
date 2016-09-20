var mysql = require("mysql");
var connections = {};

// Creating connection
connections.getConnection = function(dbname, callback){
  	
    var pool = mysql.createPool({
        connectionLimit : 100,
    		host: "localhost",
    		user: "root",
    		password: "happiestminds",
    		database: "expert-system"
  	});

    pool.getConnection(function(err, con) {
        if(err){
            console.log('Error connecting to Db');
            throw err;
        }else{
          callback(null, con);
        }
    });
  	
}

module.exports = connections;