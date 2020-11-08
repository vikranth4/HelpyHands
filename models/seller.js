var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var uniqueValidator = require('mongoose-unique-validator');

var sellerSchema = new mongoose.Schema({
	username: String,
    code: String,
    category:String,
	products:[
        {
            name:String,
            picture:String,
            price:Number
        }
    ]


});

module.exports = mongoose.model("Seller", sellerSchema);