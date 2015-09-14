var Pages = require('./controllers/pages');
var Authentication = require('./controllers/authentication');
var Api = require('./controllers/api');

/**
 * Contains the list of all routes, i.e. methods, paths and the config functions
 * that take care of the actions
 */
exports.endpoints = [
	{ method: 'GET',    path: '/fitAuth',        	 			config: Authentication.fitAuth 			},
	{ method: 'GET',    path: '/authorized',         			config: Authentication.authorized 		},

	{ method: 'POST',   path: '/login',       					config: Authentication.login			},
	{ method: 'POST',   path: '/api/v1/user',       			config: Authentication.createUser		},
	{ method: 'PUT',    path: '/api/v1/user/{user_id}',        	config: Api.initUser					},

];
