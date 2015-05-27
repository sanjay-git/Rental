var path = require("path");
var mongoose = require("mongoose");
var jwt = require("jwt-simple");
// App.requireModel("users");
// var User = mongoose.model('User');
var User = App.requireModel("users");
var passport = require("passport");
module.exports = function(app) {
	app.get("/", function(req, res) {
		res.sendFile(path.join(__dirname, '..') + "/index.html");
	});

	app.post("/registerUser", passport.authenticate('local-signup', {session: false}), function(req, res) {
		res.json(jwt.encode({email: res.email}, "secretKey"));
	});
	
	app.post("/loginUser", passport.authenticate('local-login', {session: false}), function(req, res) {
		res.json(jwt.encode({email: res.email}, "secretKey"));
	});
}