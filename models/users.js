var mongoose = require("mongoose");
var Review = require("./review");
var passportLocalMongoose = require("passport-local-mongoose");
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: { type: String, unique: true, required: true },
	resetPasswordExpires: Date,
	resetPasswordToken: String,
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review"
		}
	],
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);