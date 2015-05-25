var mongoose = require('mongoose');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
	email: {type: String, required: true, unique:true, lowercase:true},
	salt: String,
	hash: String
});

userSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	console.log(this.salt + "    and this.hash: " + this.hash);
}

userSchema.statics.findByEmailPassword = function(user, cb) {
	var self = this;
	var salt, hash;
	return this.findOne({email: user.email}, function(err, result){
		if(err) console.log(err);
		if(!result) console.log("empty result meaning user doesn't exist");
		else 
		{
			salt = result.salt;
			hash = crypto.pbkdf2Sync(user.password, salt, 1000, 64).toString('hex');
			if(hash !== result.hash) {
				console.log("incorrect password");
			} else {
				console.log("user exists.. proper creds");
			}
		}
	})
}

mongoose.model("User", userSchema);