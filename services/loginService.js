// Importing required modules
var mysql = require("mysql");
var execute = require("../connections/curdOperations");
var uuid = require('node-uuid');

var loginServices = {};

// Build query and pass to curdOperations
loginServices.auth = function(username, password, callback){

  	var selectQuery = 'SELECT id, username, password, active FROM users WHERE username = ?';
  	var values = [username];
  	
    execute.selectQuery(selectQuery, values, 'users', function(err, user){
    	if(err){
            console.log('Error in authenticating user');
            throw err;
        }

        // Username matched logic
        var uData = {};
        if(user.length <= 0){
            uData.s_code = -1;
            uData.e_msg = "Username is Incorrect.";
            callback(null, uData);
        }else{

            // Check for password
            if(password === user[0].password){

                // Check for user active or not
                if("true" === user[0].active){
                    
                    var selectQuery = 'SELECT role FROM roles WHERE users_id = ?';
                    var values = [user[0].id];

                    // Getting roles here for authenticated user
                    execute.selectQuery(selectQuery, values, 'users', function(err, roles){
                        if(err){
                            console.log('Error in getting roles');
                            throw err;
                        }else{
                            
                            // Creating session and persisting
                            var ses_id = uuid.v4();
                            var insertQuery = 'INSERT INTO sessions (sid, users_id) VALUES (?, ?)';
                            var sid = [ses_id, user[0].id];
                            execute.insertQuery(insertQuery, sid, 'users', function(err, insertedRow){
                                if(err){
                                    console.log('Error in getting roles');
                                    throw err;
                                }else{
                                    
                                    // If session persisted send res. success
                                    if(insertedRow.insertId){
                                        var role = [];
                                        for (var i = 0; i < roles.length; i++) {
                                            role.push(roles[i].role);
                                        }
                                        uData.s_code = 0;
                                        uData.sid = ses_id;
                                        uData.uid = user[0].id;
                                        uData.roles = role;
                                        callback(null,uData);
                                    }else{
                                        uData.s_code = -1;
                                        uData.e_msg = "Couldn't create session id.";
                                        callback(null, uData);
                                    }
                                }
                            });
                        }
                    });
                }else{
                    uData.s_code = 1;
                    uData.e_msg = "User is Disabled.";
                    callback(null, uData);
                }
            }else{
                uData.s_code = -1;
                uData.e_msg = "Password is Incorrect.";
                callback(null, uData);
            }
        }
  	});
}

loginServices.auth1 = function(uname, callback){
    console.log("inside /name")
    if(uname === 'soham'){

    }else{
        console.log("inside /name///////")
        var err = new Error('User not found');
        callback(err, null) 
    }
};

module.exports = loginServices;