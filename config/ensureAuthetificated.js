var User = require('../models/user')
module.exports = function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		User.getUserById(req.session.passport.user,function (err, user) {
			if (user.verified) {
				if (req.session.inauthorized_route) {
					var route = req.session.inauthorized_route
					req.session.inauthorized_route = undefined;
					res.redirect(route)
				}else{
					return next();
				}
			}else{
				req.logout();
				req.flash('error_msg',"Votre compte n'est pas confirmé ! vérifier votre boîte de réception pour confirmer : "+user.email);
				res.redirect('/users/login');
			}
		})
	} else {
		req.session.inauthorized_route = req.originalUrl;
		// req.flash('error_msg','Vous n\'êtes pas connecté');
		res.redirect('/users/login');
	}
}
