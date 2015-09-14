var Mongoose = require('../database').Mongoose;

//create the schema
var userSchema = new Mongoose.Schema({
	user_id: 	  			{ type: String},
	full_name: 				{ type: String},
	access_token:			{ type: String},
	access_token_secret:	{ type: String},
	creation_date: 			{ type: Date,		required: true, default: Date.now },
});

//create the model and add it to the exports
var User = exports.User = Mongoose.model('User', userSchema, 'Users');
