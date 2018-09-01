var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	home_url: {
		type: String
	},
	password: {
		type: String
	},
	email: {
		type: String,
		index: true
	},
	verified : {
		type : Boolean
	},
	name: {
		type: String
	},
	accounts: {
		type: Object
	},
	numbers: {
		type: Object
	},
	address : {
		type : String
	},
	province : {
		type : String
	},
	randomstring : {
		type : String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback) {
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(newUser.password, salt, function (err, hash) {
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

module.exports.updateUser = function (newUser, callback) {
	User.replaceOne({
			_id: newUser._id
		},
		newUser, {
			upsert: false
		}, callback)
}

module.exports.getUserByEmail = function (email, callback) {
	var query = {
		email
	};
	User.findOne(query, callback);
}

module.exports.getUserById = function (id, callback) {
	User.findById(id, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
		if (err) throw err;
		callback(null, isMatch);
	});
}