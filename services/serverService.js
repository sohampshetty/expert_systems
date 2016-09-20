var execute = require("../connections/curdOperations");

var serverServices = {};

/* This method purpose is to get status of server by IP.
    Query will be build depending upon status required for all IP or specific IP.
*/
serverServices.getStatusByIp = function(ip, callback){
    var selectQuery;
    var values = [];
    if(ip.toLowerCase() === "all"){
        selectQuery = 'SELECT s.ip_port, s.s_name, st.status ' + 
        'FROM service AS s INNER JOIN status AS st ON s.ip_port = st.ip_port';
    }else{

        // Start -- This logic is for adjusting input to requied format to execute query
        var ip_arr = ip.split(",");
        var u_ip = "";
        for (var i = 0; i < ip_arr.length; i++) {
            u_ip = u_ip + '\''+ip_arr[i]+'\''+',';
        }
        u_ip = u_ip.replace(/,$/, "");
        // End -- This logic is for adjusting input to requied format to execute query
       
        selectQuery = 'SELECT s.ip_port, s.s_name, st.status ' + 
        'FROM service AS s INNER JOIN status AS st ON s.ip_port = st.ip_port WHERE st.ip_port '+
        'IN ('+ u_ip +')';
    } 	
  	execute.selectQuery(selectQuery, values, 'servers', function(err, s_status){
    	if(err){
            console.log('Error in authenticating user');
            throw err;
        }
        var result = {};
        result.s_code = s_status.length > 0 ? 0 : 1 ;
        result.status = s_status;
        callback(null, result);   
  	});
}

/* This method purpose is to get status of server by system name.
    Query will be build depending upon status required for all system name or specific system name.
*/
serverServices.getStatusBySysname = function(sysName, callback){
    var selectQuery;
    var values = [];
    if(sysName.toLowerCase() === "all"){
        selectQuery =   'SELECT s.sys_name, SUM(CASE st.status WHEN \'up\' THEN 1 ELSE 0 END) AS live, '+
                    'SUM(CASE st.status WHEN \'down\' THEN 1 ELSE 0 END) AS dead FROM service AS s '+
                    'INNER JOIN status st '+
                    'ON s.ip_port = st.ip_port WHERE st.ip_port IN (SELECT ip_port FROM service) '+
                    'GROUP BY s.sys_name';
    }else{
        
        // Start -- This logic is for adjusting input to requied format to execute query
        var ip_arr = sysName.split(",");
        var u_ip = "";
        for (var i = 0; i < ip_arr.length; i++) {
            u_ip = u_ip + '\''+ip_arr[i]+'\''+',';
        }
        u_ip = u_ip.replace(/,$/, "");
        // End -- This logic is for adjusting input to requied format to execute query

        selectQuery = 'SELECT s.sys_name, SUM(CASE st.status WHEN \'up\' THEN 1 ELSE 0 END) AS live, '+
                    'SUM(CASE st.status WHEN \'down\' THEN 1 ELSE 0 END) AS dead FROM service AS s '+
                    'INNER JOIN status AS st '+
                    'ON s.ip_port = st.ip_port WHERE st.ip_port in '+ 
                    '(SELECT ip_port FROM service where s.sys_name IN ('+ u_ip +')) '+
                    'GROUP BY s.sys_name';
    }  
    execute.selectQuery(selectQuery, values, 'servers', function(err, s_status){
        if(err){
            console.log('Error in authenticating user');
            throw err;
        }
        var result = {};
        result.s_code = s_status.length > 0 ? 0 : 1 ;
        result.status = s_status;
        callback(null, result);   
    });
}

module.exports = serverServices;