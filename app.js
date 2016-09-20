// Importing required modules
var express = require('express');
var bodyParser = require('body-parser');

// Importing controller
var loginController = require('./controllers/loginController.js');
var serverController = require('./controllers/serverController.js');

// Init App
var app = express();

// Set Static Folder
app.use(express.static(__dirname+'/expert-system client')); 

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Registering URL to the controllers
app.use('/login', loginController);
app.use('/moniter/status', serverController);

app.use(function(err, req, res, next) {
	res.json(err.message);
    next();
});

// Set port
app.set('port', (process.env.PORT || 3000));

// Message to know status of port
app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
