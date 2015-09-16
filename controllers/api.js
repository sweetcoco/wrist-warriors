var Config = require('../config');
var Joi = require('joi');
var User = require('../models/user').User;


/**
 * Handles a call to /api/users/{userId} and updates the user
 */
exports.updateUser = {
	auth: 'session',
	validate: {
        payload: {
            fitbitToken: {
				token: {
					token: {
						access_token: Joi.string().required(),
						expires_in: Joi.number().required(),
						refresh_token: Joi.string().required(),
						scope: Joi.string().required(),
						token_type: Joi.string().required(),
						user_id: Joi.string().required(),
						expires_at: Joi.string().required()
					}
				}
			}
        }
    },
	handler: function (request, reply) {
		console.log(request.payload);
		User.findByIdAndUpdate(request.params.user_id, { credential_type: { fitbit: request.payload.fitbitToken } }, function(err, user) {
			if (err) return reply(err);
			return reply({user:user});
		});
  	}
};
