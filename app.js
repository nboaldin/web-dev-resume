'use strict';
var express = require('express');
var app = express();
var multer = require('multer');
var nodemailer = require('nodemailer');
var body = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var routes = require('./routes/index.js');


//Mongo connect
mongoose.connect('mongodb://localhost:27017/firstExpressApp');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('db connection successful for firstExpressApp');
});

// use sessions for tracking logins
app.use(session({
  secret: '',
  resave: true,
  saveUninitialized: false,
  unset: 'destroy',
  store: new MongoStore({
    url: 'mongodb://localhost:27017/firstExpressApp'
  })
}));

//make certain vars available to template
app.use((req, res, next)=> {
  res.locals.currentUser = req.session.userId;
  next();
});


app.use(body.urlencoded({ extended: true }));
app.use(body.json());
app.use(multer({dest: __dirname +'/public/uploads'}).any());



//Serve static files
app.use('/public', express.static('public'));

//Set template engine
app.set('view engine', 'pug')
app.set('views', __dirname + '/views');

app.use(routes);

// catch 404 and forward to error handler
app.use(function(err, req, res, next){
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// Error Handler

app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});

var port = process.env.PORT || 3000;

app.listen(3000, console.log('App listening on port', port));
