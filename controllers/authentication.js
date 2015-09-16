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
	handler: function(request, reply) {
		var newUser,
			typeOfCreate = request.payload.typeOfCreate,
			fitbitToken = request.payload.fitbitToken;

		if (typeOfCreate === 'fitbit') {
			newUser = new User ({
				account_type: "fitbit",
				credential_type:[{
									fitbit: fitbitToken
								}],
				password: "",
				email: "",
			});

			newUser.save();

			request.auth.session.set(newUser);

			reply({user: newUser});
		}
	}
};



/**
 * Responds to POST /login and logs the user in.
 */
exports.login = {
	handler: function(request, reply) {
		var newUser,
			typeOfLogin = request.payload.typeOfLogin,
			fitbitToken = request.payload.fitbitToken,
			fitbitUserId = fitbitToken.token.token.user_id;

		if (typeOfLogin === 'fitbit') {
			User.findOne({'credential_type.fitbit.token.token.user_id': fitbitUserId}, function (err, user) {
				if (err) {
					return reply(err);
				}

				if (user) {
					request.auth.session.set(user);
					return reply({user: user});
				}
			});
		}
	}
};





var Config = require('../config');
var FitbitClient = require('fitbit-client-oauth2');
var client = new FitbitClient(Config.fitAuth.appId, Config.fitAuth.consumerSecret);
// var redirect_uri = 'https://www.fitbit.com/oauth2/success' /*'http://localhost:8000/authorized'*/;
var redirect_uri = 'http://localhost:8000/authorized';
var scope =  [ 'activity', 'nutrition', 'profile', 'settings', 'sleep', 'social', 'weight' ];

/**
 * Responds to GET /fitAuth and and is the first stage of auth.
 */
exports.fitAuth = {
	handler: function (request, reply) {
		var authorization_uri = client.getAuthorizationUrl(redirect_uri, scope);

		reply().redirect(authorization_uri);
	}
};


/**
 * Responds to GET /authorized and and is the final stage of auth.
 */
exports.authorized = {
	handler: function (request, reply) {

		var code = request.query.code;

		client.getToken(code, redirect_uri)
            .then(function(token) {

                // ... save your token on db or session...

                // then redirect
                //reply.redirect(302, '/user');
				reply({token:token});

            })
            .catch(function(err) {
                // something went wrong.
                reply(err);

            });
	}
};
