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

userSchema.methods.comparePasswords = function(password) {
	console.log("inside commparePasswords: " + password);
	console.log(this);
	var salt = this.salt;
	hash = crypto.pbkdf2Sync(password, salt, 1000, 64).toString('hex');
	return hash === this.hash;
};

userSchema.statics.findByEmailPassword = function(user, done) {
	this.findOne({email: user.email}, function(err, result){
		if(err) {
			console.log(err);
			done(err);
		};
		if(!result) {
			console.log("empty result meaning user doesn't exist");
			done(null, false, " No user exists");
		}
		else
		{
			if(result.comparePasswords(user.password)) {
				console.log("user exists.. proper creds");
				done(null, result);
			} else {
				console.log("incorrect password");
				done(null, false, "Incorrect Password");
			}
		}
	})
}

mongoose.model("User", userSchema);