var express = require('express');
var bodyParser = require('body-parser');
var env = process.env.NODE_DEV || 'development';
var path = require('path');
var packageJson = require('../package.json');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');

global.App = {
	env: env,
	port: process.env.port || 4000,
	version: packageJson.version,
	serverName: packageJson.name,
	root: path.join(__dirname, ".."),
	app: express(),
	appPath: function(path) {
		return this.root + '/' + path;
	},
	start: function() {
		if(!this.started) {
			this.started = true;
			console.log("Starting " + App.serverName + " Version " + App.version + " on port " + App.port + " in mode: " + App.env);
			App.app.listen(this.port)
		}
	},
	requireModel: function(modelName) {
		console.log("model abs path: " + this.appPath("models/" + modelName));
		return require(this.appPath("models/" + modelName))
	}
}

// require(path.join(__dirname, '..') + "/config/routes")(App.app);
App.app.use(bodyParser.json());
App.app.use(bodyParser.urlencoded({ extended: false }));
App.app.use('/',express.static(App.appPath('public')));
require("./routes")(App.app);

if(env === "development")
	mongoose.connect("mongodb://localhost/news");
else {
	
}