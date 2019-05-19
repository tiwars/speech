var express = require('express');
// var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator')
var methodOverride = require('method-override');
var _ = require('lodash');

// Create the application.

var app = express();

// Add Middleware necessary for REST API's

app.use(cookieParser());

app.use(expressSession({
	secret:'secret',
	saveUninitialized: true,
	// maxAge:24 * 60 * 60 * 1000 //24 hours
	resave: true
}));

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(methodOverride('X-HTTP-Method-Override'));



// CORS Support

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});


// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
// View Engine

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// Set Static Folder

var server = require('http').Server(app);



app.use(express.static(path.join(__dirname, 'public')));
	var routes = require('./controllers/SpeechController');
	app.use('/',routes)
	app.set('port', (process.env.PORT || 3000)); //todo change this to 8080

	server.listen(app.get('port'), function(){
		console.log('Server started on port '+app.get('port'));
	});

	app.use(function(req, res) {
		res.status(404);
		res.render('404');
	});
