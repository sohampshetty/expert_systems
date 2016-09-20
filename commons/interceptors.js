var express = require('express');
var validator = require('validator');
var url = require('url');
var execute = require("../connections/curdOperations");

/* This method work as interceptor where it authenticate session id and user is relationship 
assigned. In any case if we didn't find relationship we need to remove destroy session */
var ensureAuthenticated = function ensureUserAuth(req, res, next) {
  	
  	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
  	
  	var sid = req.query.sid;
	var uid = req.query.uid;

  	// Parameter validation
	if(validator.isNull(sid) || validator.isNull(uid)){
		res.json({'s_code': -1, 'e_msg': "User id and session is cannot be null."});
	}else{
		
		var selectQuery = 'select sid, users_id from sessions where sid = ?'+ 
						' && users_id = (select id from users where id = ? && active = \'true\' )';
  		var values = [sid, uid];
  		
  		// For sessioned is assigned user and user is active or not currently
	    execute.selectQuery(selectQuery, values, 'users', function(err, sesUser){
	    	if(err){
	            console.log('Error in authenticating user');
	            throw err;
	        }
	        if(sesUser.length > 0){
	        	next();
	        }else{
	        	res.json({'s_code': -1, 'e_msg': "Session expired."});
	        }
		});
	}
}

module.exports = ensureAuthenticated;

/*router.use(function (req, res, next) {
	req.session.redirectTo = req.url;	
  	if(req.isAuthenticated()){
		console.log("if...................................................................");
		return next();
	}else{
		console.log('========================================================= '+req.url);
		if (req.url == '/users/register'){
			console.log("if..............................................................2");
			return next();
		}else{
			if (req.url == '/'){
				console.log("if........................................................3");
				res.render('users/register');
			}else{
				res.render('users/login');
			}
		}
	}
});*/
