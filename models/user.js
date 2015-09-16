var Mongoose = require('../database').Mongoose;

//create the schema
var userSchema = new Mongoose.Schema({
	account_type: String,
	credential_type:[{
						fitbit: {
							token: {
								token: {
									access_token: String,
									expires_in: Number,
									refresh_token: String,
									scope: String,
									token_type: String,
									user_id: String,
									expires_at: String
								}
							}
						}
					}],
	password: String,
	email: String,
	creation_date: { type: Date, required: true, default: Date.now },
});

userSchema.plugin(require('passport-local-mongoose'), { usernameField: 'email', hashField: 'password', usernameLowerCase: true });

//create the model and add it to the exports
var User = exports.User = Mongoose.model('User', userSchema, 'Users');
