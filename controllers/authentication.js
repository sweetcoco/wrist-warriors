var Joi = require('joi');
var User = require('../models/user').User;
//
// /**
//  * Responds to POST /login and logs the user in, well, soon.
//  */
// exports.login = {
// 	validate: {
//         payload: {
//             email: Joi.string().email().required(),
//             password: Joi.string().required()
//         }
//     },
// 	handler: function (request, reply) {
//
// 		// In the version with Travelogue and Mongoose this was all handled by Passport (hence we retrieved
// 		// Passport and inserted the request and reply variables).
// 		User.authenticate()(request.payload.email, request.payload.password, function (err, user, message) {
//
// 			// There has been an error, do something with it. I just print it to console for demo purposes.
// 			if (err) {
// 				console.error(err);
// 				return reply.redirect('/login');
// 			}
//
// 			// If the authentication failed user will be false. If it's not false, we store the user
// 			// in our session and redirect the user to the hideout
// 			if (user) {
// 				request.auth.session.set(user);
// 				return reply.redirect('/batmanshideout');
// 			}
// 			return reply(message);
//
// 		});
//     }
// };
//
// /**
//  * Responds to GET /logout and logs out the user
//  */
// exports.logout = {
// 	auth: 'session',
// 	handler: function (request, reply) {
// 		request.auth.session.clear();
// 		reply().redirect('/');
// 	}
// };
//
/**
 * Responds to POST /api/v1/user and creates a new user.
 */
exports.createUser = {
	validate: {
		payload: {
			typeOfCreate: Joi.string().required(), //is this real user creation, or ghost user? (real, fitbitGhost, googleFitGhost)
            email: Joi.string().email().allow(null),
            password: Joi.string().allow(null),
			fitbitUserId: Joi.string().allow(null),
			fitbitAccessToken: Joi.string().allow(null),
			fitbitAccessTokenSecret: Joi.string().allow(null)
        }
	},
	handler: function(request, reply) {
		var newUser,
			typeOfCreate = request.payload.typeOfCreate,
			fitbitUserId = request.payload.fitbitUserId,
			fitbitAccessToken = request.payload.fitbitAccessToken,
			fitbitAccessTokenSecret = request.payload.fitbitAccessTokenSecret,
			emailRand = Math.floor(Date.now() / 1000),
			passwordRand = Math.floor(Date.now() / 1000) + Math.floor((Math.random() * 100) + 1);

		if (typeOfCreate === 'fitbitGhost') {
			newUser = new User ({
				is_real: false,
				credential_type: 	[{ fitbit: {
										user_id: fitbitUserId,
										access_token: fitbitAccessToken,
										access_token_secret: fitbitAccessTokenSecret
										}
									}],
				email: 'ghost' + emailRand + '@ghost.com'
			});

			User.register(newUser, 'passwordRand' + passwordRand, function(err, user) {
				if (err) {
					return reply(err);
				}


				reply({user:{
					_id: newUser._id,
					is_real: newUser.is_real,
					credential_type: newUser.credential_type,
					creation_date: newUser.creation_date
				}});
			});
		}


		// if (type === 'real') {
		// 	// Create a new user, this is the place where you add firstName, lastName etc.
		// 	// Just don't forget to add them to the validator above.
		// 	newUser = new User({
		// 		email: request.payload.email
		// 	});
		//
		// 	// The register function has been added by passport-local-mongoose and takes as first parameter
		// 	// the user object, as second the password it has to hash and finally a callback with user info.
		// 	User.register(newUser, request.payload.password, function(err, user) {
		// 		// Return error if present
		// 		if (err) {
	    //             return reply(err);
	    //         }
		//
	    //         reply().redirect('/login');
	    //     });
		// }


	}
};



/**
 * Responds to POST /login and logs the user in.
 */
exports.login = {
	validate: {
		payload: {
			typeOfLogin: Joi.string().required(), //is this real user login, or ghost user? (real, fitbitGhost, googleFitGhost)
            email: Joi.string().email().allow(null),
            password: Joi.string().allow(null),
			fitbitUserId: Joi.string().allow(null),
			fitbitAccessToken: Joi.string().allow(null),
			fitbitAccessTokenSecret: Joi.string().allow(null)
        }
	},
	handler: function(request, reply) {
		var newUser,
			typeOfLogin = request.payload.typeOfLogin,
			fitbitUserId = request.payload.fitbitUserId,
			fitbitAccessToken = request.payload.fitbitAccessToken,
			fitbitAccessTokenSecret = request.payload.fitbitAccessTokenSecret;

		if (typeOfLogin === 'fitbitGhost') {
			User.findOne({'credential_type.fitbit.access_token_secret': fitbitAccessTokenSecret}, function (err, user) {
				if (err) {
					return reply(err);
				}
				reply({user:{
					_id: user._id,
					is_real: user.is_real,
					credential_type: user.credential_type,
					creation_date: user.creation_date
				}});
			});
		}
	}
};















var Config = require('../config');
var FitbitApiClient = require("fitbit-node");
var client = new FitbitApiClient(Config.fitAuth.consumerKey, Config.fitAuth.consumerSecret);

var requestTokenSecrets = {};

/**
 * Responds to GET /fitAuth and and is the first stage of auth.
 */
exports.fitAuth = {
	handler: function (request, reply) {

		client.getRequestToken().then(function (results) {
			var token = results[0],
				secret = results[1];
			requestTokenSecrets[token] = secret;

			reply().redirect("http://www.fitbit.com/oauth/authorize?oauth_token=" + token); // change authorize to authenticate to not prompt every time
		});
	}
};


/**
 * Responds to GET /authorized and and is the final stage of auth.
 */
exports.authorized = {
	handler: function (request, reply) {

		var token = request.query.oauth_token,
			secret = requestTokenSecrets[token],
			verifier = request.query.oauth_verifier;

		client.getAccessToken(token, secret, verifier).then(function (results) {
			var accessToken = results[0],
				accessTokenSecret = results[1],
				userId = results[2].encoded_user_id;
				console.log(results);


				// https://api.fitbit.com/1/user/[user-id] already appended to url, in this case "/profile.json"
				// /activities/steps/date/today/1d.json  -returns steps for a day
			return client.get("/profile.json", accessToken, accessTokenSecret).then(function (results) {
				var response = results[0];
				reply(response);
			});
		});
	}
};
