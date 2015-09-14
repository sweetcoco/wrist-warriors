var Mongoose = require('../database').Mongoose;

//create the schema
var userSchema = new Mongoose.Schema({
	is_real: Boolean,
	credential_type: 	[{ fitbit: {
							user_id: String,
							access_token: String,
							access_token_secret: String
							}
						}],
	password: String,
	email: String,
	creation_date: { type: Date, required: true, default: Date.now },
});

userSchema.plugin(require('passport-local-mongoose'), {usernameField: 'email', hashField: 'password', usernameLowerCase: true });

//create the model and add it to the exports
var User = exports.User = Mongoose.model('User', userSchema, 'Users');
