// Importing required modules
var express = require('express');
var router = express.Router();
var validator = require('validator');
var loginService = require("../services/loginService");

// Users authentication 
router.post('/', function(req,res){
	var uname = req.body.uname;
	var passwd = req.body.passwd;

	// Parameter validation
	if(validator.isNull(uname) || validator.isNull(passwd)){
		res.json({'s_code': -1, 'e_msg': "Username or Password cannot be null."});
	}else{
		loginService.auth(uname, passwd, function(err, jsonRes){
			res.json(jsonRes);
		});
	}
});

router.get('/name', function(req, res, next){
	var uname = req.body.uname;
	var passwd = req.body.passwd;
	console.log(uname);
	loginService.auth1('uname', function(err, jsonRes){
		if(err) return next(err);
		res.json({'json':'dabba'});
	
	})
})

module.exports = router;
