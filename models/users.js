var mongoose = require('mongoose');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
	email: {type: String, required: true, unique:true, lowercase:true},
	salt: String,
	hash: String
});

userSchema.pre('save', function(next) {
	var password = this.salt;
	this.salt = crypto.randomBytes(16).toString('hex');
	console.log("password:" + password);
	console.log(this);
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	console.log(this.salt + "    and this.hash: " + this.hash);
	next();
});

// userSchema.statics.comparePasswords = function(reqUser, user) {
// 	console.log("inside commparePasswords");
// 	console.log(this);
// 	var salt = user.salt;
// 	hash = crypto.pbkdf2Sync(reqUser.password, salt, 1000, 64).toString('hex');
// 	return hash === user.hash;
// };

userSchema.statics.findByEmailPassword = function(user, cb) {
	var self = this;
	var salt, hash;
	console.log(user);
	return this.findOne({email: user.email}, function(err, result){
		if(err) {
			console.log(err);
			throw(err);
		};
		if(!result) console.log("empty result meaning user doesn't exist");
		else 
		{
			var userHash = crypto.pbkdf2Sync(user.password, result.salt, 1000, 64).toString('hex');
			if(userHash === result.hash) {
				console.log("incorrect password");
			} else {
				console.log("user exists.. proper creds");
			}
		}
	})
}

mongoose.model("User", userSchema);