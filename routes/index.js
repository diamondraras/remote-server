var express = require('express');
var router = express.Router();
var User = require('../models/user');
var ensureAuthenticated = require('../config/ensureAuthetificated')

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	// console.log(req.session)
	if (req.session.inauthorized_route == "/" || !req.session.inauthorized_route) {

		User.getUserById(req.session.passport.user, function(err, user){

			res.render('index',{
				name : user.name,
				email : user.email,
				synchronized : user.socket!=null,
				nb_accounts : user.accounts?user.accounts.length:0,
				nb_numbers : (user.numbers.home && user.numbers.neighbours)?user.numbers.home.length+user.numbers.neighbours.length:0
			});
		})
	}else{
		res.redirect(req.session.inauthorized_route)
		// req.session.inauthorized_route = undefined
	}
});
router.get("/test",function (req, res) {
	res.render("test")
})

module.exports = router;