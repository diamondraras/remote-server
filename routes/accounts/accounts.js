var express = require('express');
var router = express.Router();
var ensureAuthenticated = require('../../config/ensureAuthetificated')
var moment = require('../../config/moment')

var User = require('../../models/user');
var verifyIfExistingAccount = require('./verifyIfExistingAccount')
var verifyInMe = require('./verifyInMe')
var format_accounts = require('./format_accounts')

router.get('/', ensureAuthenticated, function (req, res) {
	req.session.last_route = undefined
	User.getUserById(req.session.passport.user, function (err, user) {
		res.render('accounts', {
			name: user.name,
			email: user.email,
			accounts: format_accounts(user.accounts),
		});
	})
});

router.post('/add', ensureAuthenticated, function (req, res) {
	req.checkBody('link', 'Un lien de votre profil facebook est requis').notEmpty();
	req.checkBody('senderId', 'Votre senderID est requis').notEmpty();
	var errors = req.validationErrors();
	if (errors){
		User.getUserById(req.session.passport.user, function (err, user) {
			req.flash('error_msg', "Veuillez remplir tous les champs !")
			res.redirect("/accounts")
		})
	}else if(/\s/.test(req.body.senderId)){
		req.flash('error_msg', "Le senderId ne doit contenir aucun espace")
		res.redirect("/accounts")
		
	}else{
		User.getUserById(req.session.passport.user, function (err, user) {
			User.find({},function(err, users){
				
			if (verifyIfExistingAccount(users,req.body.senderId)) {
				if (verifyInMe(user,req.body.senderId)) {
					req.flash('error_msg', "Ce compte a été déjà ajouté dans votre liste")
				}else{
					req.flash('error_msg', "Ce compte a été déjà ajouté par un autre utilisateur")
				}
				res.redirect('/accounts')
			} else {
				var link = req.body.link;
				var senderId = req.body.senderId;
				var temp_user = user
				temp_user.accounts.push({
					link: link,
					senderId: senderId,
					added_at : moment()
				})
				User.updateUser(temp_user, function (err, updated_user) {
					if (err) throw err
					else {
						res.redirect('/accounts')
					}
				})
			}
			})
	
		})
	}

});
router.get('/add/:senderId', ensureAuthenticated, function (req, res) {
	req.session.last_route = req.route.path
	User.getUserById(req.session.passport.user, function (err, user) {

		res.render('accounts', {
			name: user.name,
			email: user.email,
			accounts: format_accounts(user.accounts),
			new_senderId: req.params.senderId
		});
		req.session.last_route = "/accounts"
	})
})

router.post('/removeOne', ensureAuthenticated, function (req, res) {
	var senderId = req.body.senderId
	User.getUserById(req.session.passport.user, function (err, user) {
		var removedOne = []
		for (let index = 0; index < user.accounts.length; index++) {
			const element = user.accounts[index];
			if (element.senderId != senderId) {
				removedOne.push(element)
			}
		}
		user.accounts = removedOne
		User.updateUser(user, function (err, updated_user) {
			if (err) throw err;
			else {
				res.redirect('/accounts')
			}
		})
	})
})

module.exports = router;