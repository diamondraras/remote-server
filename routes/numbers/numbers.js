var express = require('express');
var router = express.Router();
var ensureAuthenticated = require('../../config/ensureAuthetificated')
var User = require('../../models/user');
var verifyIfExistingNumber = require('./verifyIfExistingNumber')
router.get('/', ensureAuthenticated, function (req, res) {
	req.session.last_route = req.route.path
	User.getUserById(req.session.passport.user, function (err, user) {

		res.render('numbers', {
			name: user.name,
			email: user.email,
			synchronized: user.socket != null,
			home_numbers: user.numbers.home,
			neighbours_numbers: user.numbers.neighbours
		});
	})
});

router.post('/addNumber', ensureAuthenticated, function (req, res) {

	User.getUserById(req.session.passport.user, function (err, user) {

		if (verifyIfExistingNumber(user,req.body.num,req.body.type)) {
			req.flash('error_msg', "Ce numéro a déjà été ajouté dans la catégorie "+((req.body.type=='home')?'domicile':"voisin"))
		}else{
			switch (req.body.type) {
				case "neighbours":
					user.numbers.neighbours.push({
						name: req.body.name,
						num: req.body.num
					})
					break;
				case "home":
					user.numbers.home.push({
						name: req.body.name,
						num: req.body.num
					})
					break;
			}
			User.updateUser(user, function (err, updated_user) {
				if (err) throw err
				else{
					res.redirect('/numbers')
				}
			})
		}
	})
});

router.post('/removeOne', ensureAuthenticated, function (req, res) {
	if (req.body.neighbours) {
		console.log("neighbours")
		User.getUserById(req.session.passport.user, function (err, user) {
			var removedOne = []
			for (let index = 0; index < user.numbers.neighbours.length; index++) {
				const element = user.numbers.neighbours[index];
				if (element.num != req.body.neighbours) {
					removedOne.push(element)
				}
			}
			user.numbers.neighbours = removedOne
			User.updateUser(user, function (err, updated_user) {
				if (err) throw err;
			})
		})
	} else if(req.body.home){
		console.log("home")
		User.getUserById(req.session.passport.user, function (err, user) {
			var removedOne = []
			for (let index = 0; index < user.numbers.home.length; index++) {
				const element = user.numbers.home[index];
				if (element.num != req.body.home) {
					removedOne.push(element)
				}
			}
			user.numbers.home = removedOne
			User.updateUser(user, function (err, updated_user) {
				if (err) throw err;
				else{
					res.redirect('/numbers')
				}
			})
		})
	}
})

module.exports = router;