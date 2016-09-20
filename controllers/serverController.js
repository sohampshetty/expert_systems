// Importing required modules
var express = require('express');
var router = express.Router();
var serverService = require("../services/serverService");
var ensureUserAuth = require("../commons/interceptors");
var url = require('url');

// Getting status of servers via IP
router.get('/service', ensureUserAuth, function(req,res){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	if(req.query.ip !== undefined){
		serverService.getStatusByIp(req.query.ip, function(err, jsonRes){
			res.json(jsonRes);
		});
	}else{
		res.json({'s_code': -1, 'e_msg': "Inputs are not correct."});
	}
});

// Getting status of servers via system name
router.get('/system', ensureUserAuth, function(req,res){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	if(req.query.sys !== undefined){
		serverService.getStatusBySysname(req.query.sys, function(err, jsonRes){
			res.json(jsonRes);
		});
	}else{
		res.json({'s_code': -1, 'e_msg': "Inputs are not correct."});
	}
});

module.exports = router;