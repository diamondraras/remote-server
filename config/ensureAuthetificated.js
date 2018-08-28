module.exports = function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
        
		req.session.inauthorized_route = req.originalUrl
		// console.log(req.session)
		req.flash('error_msg','Vous n\'êtes pas connecté');
		res.redirect('/users/login');
	}
}
