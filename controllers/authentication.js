// var Joi = require('joi');
// var User = require('../models/user').User;
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
// /**
//  * Responds to POST /register and creates a new user.
//  */
// exports.register = {
// 	validate: {
// 		payload: {
//             email: Joi.string().email().required(),
//             password: Joi.string().required()
//         }
// 	},
// 	handler: function(request, reply) {
//
// 		// Create a new user, this is the place where you add firstName, lastName etc.
// 		// Just don't forget to add them to the validator above.
// 		var newUser = new User({
// 			email: request.payload.email
// 		});
//
// 		// The register function has been added by passport-local-mongoose and takes as first parameter
// 		// the user object, as second the password it has to hash and finally a callback with user info.
// 		User.register(newUser, request.payload.password, function(err, user) {
// 			// Return error if present
// 			if (err) {
//                 return reply(err);
//             }
//
//             reply().redirect('/login');
//         });
// 	}
// };















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

				// https://api.fitbit.com/1/user/[user-id] already appended to url, in this case "/profile.json"
				// /activities/steps/date/today/1d.json  -returns steps for a day
			return client.get("/profile.json", accessToken, accessTokenSecret).then(function (results) {
				var response = results[0];
				reply(response);
			});
		});
	}
};
