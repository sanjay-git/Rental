var path = require("path");
var mongoose = require("mongoose");
App.requireModel("users");
var User = mongoose.model('User');
module.exports = function(app) {
	app.get("/", function(req, res) {
		// console.log(User);
		res.sendFile(path.join(__dirname, '..') + "/index.html");
		// res.send(require('../index.html'));
	});

	app.post("/registerUser", function(req, res) {
		console.log(req.body);
		var user = new User(req.body);
		user.setPassword(req.body.password);
		user.save(function(err, user) {
			if(err) { console.log(err); return}

			res.json(user);
		})
	});

	app.post("/loginUser", function(req, res) {
		console.log(req.body);
		User.findByEmailPassword(req.body, function(){

		});
	})
}