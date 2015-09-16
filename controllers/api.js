// var Config = require('../config');
// var Joi = require('joi');
// var User = require('../models/user').User;
// var FitbitApiClient = require("fitbit-node");
// var client = new FitbitApiClient(Config.fitAuth.consumerKey, Config.fitAuth.consumerSecret);
//
// var requestTokenSecrets = {};
//
// /**
//  * Responds to PUT /api/v1/user/user_id and returns the user account.
//  */
// exports.initUser = {
// 	validate: {
// 		payload: {
// 			fullName: Joi.string().allow(null),
//             accessToken: Joi.string().required(),
// 			accessTokenSecret: Joi.string().required()
//         }
// 	},
// 	handler: function (request, reply) {
// 		var userId = encodeURIComponent(request.params.user_id),
// 			fullName = request.payload.fullName,
// 			accessToken = request.payload.accessToken,
// 			accessTokenSecret = request.payload.accessTokenSecret;
//
// 		User.findOneAndUpdate({'user_id': userId}, {access_token: accessToken, access_token_secret: accessTokenSecret}, function (err, user) {
// 			if (err) {
// 				reply(err);
// 				return;
// 			}
//
// 			if (!user) {
// 				var newUser = new User({
// 					user_id: userId,
// 					full_name: fullName,
// 					access_token: accessToken,
// 					access_token_secret: accessTokenSecret,
// 				});
//
// 				newUser.save(function (err) {
// 					if (err) {
// 						reply(err);
// 						return;
// 					}
// 					user = newUser;
// 				});
// 				return reply({user:newUser});
// 			}
//
// 			return reply({user:user});
// 		});
// 	}
// };
