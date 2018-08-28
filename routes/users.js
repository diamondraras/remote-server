var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res){
	if(req.isAuthenticated()){
		res.redirect(req.session.last_route)
	} else {
		res.render('register');
	}
});

// Login
router.get('/login', function(req, res){
	if(req.isAuthenticated()){
		res.redirect(req.session.last_route)
	} else {
		res.render('login');
	}
});

// Register User
router.post('/register', function(req, res){
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

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			password:password,
			email: email,
			name : name,
			accounts : [],
			numbers : {
				home : [],
				neighbours : []
			}

		});

		User.getUserByEmail(email, function(err, finded_user){
			if (finded_user) {
				
				req.flash('error_msg', 'Adresse e-mail déjà utilsé');
				res.redirect('/users/register');
			}else{
				User.createUser(newUser, function(err, user){
					if(err) throw err;
					console.log(user);
					req.flash('success_msg', 'Vous êtes inscrit et pouvez maintenant vous connecter');
					res.redirect('/users/login');
				});
			}
		})
	}
});

passport.use(new LocalStrategy(
  function(email, password, done) {
   User.getUserByEmail(email, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Utilisateur non inscrit !'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
				// req.session.user = "test"
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Mot de passe incorrecte !'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
		console.log("never here")
		// req.session.user = "user"
		// console.log("user")
    // res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'Vous avez été déconnecté');

	res.redirect('/users/login');
});

module.exports = router;