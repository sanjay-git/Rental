var passport = require("passport");
var mongoose = require('mongoose');
var User = App.requireModel("users");

var localStrategy = require("passport-local");
var emailPasswordStrategy = new localStrategy({ usernameField: "email", passwordField: "password"},
	function(username, password, done) {
		User.findByEmailPassword({
			email: username,
			password: password
		}, done)
});

var emailStrategy = new localStrategy({ passReqToCallback: true, usernameField: "email", passwordField: "password"},
	function(req, username, password, done){
		User.findOne({'email': username}, function(err, user) {
			if(err) {
				done(err);
			}

			if(user) {
				console.log("user already exists. cannot sign up");
				done(null, false, "User exists");
			} else {
				var user = new User({email: username, salt: password, phone: req.body.phone, city: req.body.city});
				user.save(function(err, newUser) {
					if(err) {
						done(err);
					}
					done(null, newUser);
					// res.json(jwt.encode({email: user.email}, "secretKey"));
				})
			}
		})
	})
module.exports = function(app) {
	passport.use('local-login', emailPasswordStrategy);
	passport.use('local-signup', emailStrategy);
	app.use(passport.initialize());
}