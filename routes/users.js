var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var randomstring = require('randomstring')
var User = require('../models/user');
var ensureAuthenticated = require('../config/ensureAuthetificated')
var sendmail = require('../config/sendmail')
var url = "smart-minds.herokuapp.com"
// Register
router.get('/register', function (req, res) {
	if (req.isAuthenticated()) {
		res.redirect(req.session.last_route)
	} else {
		res.render('register');
	}
});

// Login
router.get('/login', function (req, res) {
	if (req.isAuthenticated()) {
		res.redirect(req.session.last_route)
	} else {
		res.render('login');
	}
});

// Register User
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Votre nom complet est requis').notEmpty();
	req.checkBody('email', 'Votre adresse email est requis').notEmpty();
	req.checkBody('email', 'Format de l\'adresse email invalide').isEmail();
	req.checkBody('password', 'Un mot de passe est requis').notEmpty();
	req.checkBody('password2', 'Les deux mots de passe doivent être identiques').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	} else {
		var newUser = new User({
			password: password,
			email: email,
			verified: false,
			name: name,
			accounts: [],
			numbers: {
				home: [],
				neighbours: []
			},
			randomstring: randomstring.generate(30)

		});

		User.getUserByEmail(email, function (err, finded_user) {
			if (finded_user) {

				req.flash('error_msg', 'Adresse e-mail déjà utilsé');
				res.redirect('/users/register');
			} else {
				User.createUser(newUser, function (err, user) {
					if (err) throw err;
					req.flash('success_msg', 'Vous êtes inscrit ! Vérifier votre mail pour connecter');
					res.redirect('/users/login');
					console.log("/users/activate/" + user._id + "/" + user.randomstring)
					sendmail(user.email, url+"/users/activate/" + user._id + "/" + user.randomstring)
				});
			}
		})
	}
});

passport.use(new LocalStrategy(
	function (email, password, done) {
		User.getUserByEmail(email, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, {
					message: 'Utilisateur non inscrit !'
				});
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					// req.session.user = "test"
					return done(null, user);
				} else {
					return done(null, false, {
						message: 'Mot de passe incorrecte !'
					});
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
		failureFlash: true
	}),
	function (req, res) {});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'Vous avez été déconnecté');

	res.redirect('/users/login');
});

router.post('/update', ensureAuthenticated, function (req, res) {
	User.getUserById(req.session.passport.user, function (err, user) {
		if (user.email != req.body.email) {
			user.verified = false;
			user.email = req.body.email
			user.randomstring = randomstring.generate(30)
			console.log("/users/activate/" + user._id + "/" + user.randomstring)
			sendmail(user.email, url+"/users/activate/" + user._id + "/" + user.randomstring)
		}
		user.address = req.body.address
		user.name = req.body.name
		user.province = req.body.province
		User.updateUser(user, function (err, foo) {
			if (err) throw err;
			else {
				res.json({
					ok: true
				})
			}
		})
	})
})

router.get('/activate/:id/:randomstring', function (req, res) {
	User.getUserById(req.params.id, function (err, user) {
		if (user && !err) {
			if (req.params.randomstring == user.randomstring) {
				user.verified = true;
				User.updateUser(user, function (err, updated_user, a) {
					req.flash('success_msg', "L'adresse e-mail " + user.email + " a été vérifiée vous pouvez maintenant vous connecter");
					res.redirect('/users/login');
				})
			} else {
				req.flash('error_msg', "URL d'activation invalide")
				req.session.last_route = undefined;
				res.redirect('/users/login');
			}
		} else {
			req.flash('error_msg', "URL d'activation invalide")
			req.session.last_route = undefined;
			res.redirect('/users/login');
		}
	})
})
router.post("/updatelink", function (req, res) {
	User.getUserByEmail(req.body.email, function (err, user) {
		if (err) throw err;
		if (!user) {
			res.json({
				error : true,
				message : "Aucun utilisateur"
			})
		}

		User.comparePassword(req.body.password, user.password, function (err, isMatch) {
			console.log(req.body)
			if (err) throw err;
			if (isMatch) {
				// req.session.user = "test"
				user.home_url = req.body.link;
				User.updateUser(user, function (err, updated_user) {
					if (err) throw err;
					else{
						res.json({
							error : false
						})
					}
				})

			} else {
				res.json({
					error : true,
					message : "Mot de passe incorrecte !"
				})
			}
		});
	})
})
module.exports = router;