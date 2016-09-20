var connection = require("./connection.js");

var execute = {};

execute.insertQuery = function(query, values, dbname, callback){
    
    // getting connection
    connection.getConnection(dbname,function(err, con){
        
        if(err){
            console.log('Error connecting to Db in insert query');
            throw err;
        }else{
            // General insert query
            con.query(query, values, function(err,row){
                if(err){
                      console.log('Error executing error in insert query');
                      throw err;
                }
                con.release();
                callback(null, row)
            });
        }
    });   
}

// This method is for General select query
execute.selectQuery = function(query, values, dbname, callback){

    // getting connection we need to provide db name here
    connection.getConnection(dbname,function(err, con){
        
        if(err){
            console.log('Error connecting to Db in select query');
            throw err;
        }else{
            // General select query will be perfoemed here 
            con.query(query, values, function(err,rows){
            
                if(err){
                  console.log('Error executing error in select query');
                  throw err;
                }
                con.release();
                callback(null,rows); 
            });
        }
    });
}   

module.exports = execute;