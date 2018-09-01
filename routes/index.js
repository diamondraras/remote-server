var express = require('express');
var router = express.Router();
var User = require('../models/user');
var ensureAuthenticated = require('../config/ensureAuthetificated')

// Get Homepage
router.get('/', ensureAuthenticated, function (req, res) {

	User.getUserById(req.session.passport.user, function (err, user) {

		res.render('index', {
			name: user.name,
			email: user.email,
			synchronized: user.socket != null,
			nb_accounts: user.accounts ? user.accounts.length : 0,
			nb_home_numbers: user.numbers.home.length,
			address: user.address,
			province: user.province,
			nb_alerts_numbers: user.numbers.neighbours.length+ user.numbers.home.length,
			nb_numbers: (user.numbers.home && user.numbers.neighbours) ? user.numbers.home.length + user.numbers.neighbours.length : 0
		});
	})
});


module.exports = router;