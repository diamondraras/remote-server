var express = require('express');
var router = express.Router();
var ensureAuthenticated = require('../../config/ensureAuthetificated')
var User = require('../../models/user');
var verifyIfExistingAccount = require('./verifyIfExistingAccount')

router.get('/', ensureAuthenticated, function(req, res){
	req.session.last_route = req.route.path
	User.getUserById(req.session.passport.user, function(err, user){

		res.render('accounts',{
			name : user.name,
			email : user.email,
			synchronized : user.socket!=null,
			accounts : user.accounts
		});
	})
});

router.post('/addAccount', ensureAuthenticated, function(req, res){
	
	User.getUserById(req.session.passport.user, function(err, user){

		if(verifyIfExistingAccount(user,req.body.senderId)){
			req.flash('error_msg', "Cet utilisateur a été déjà ajouté")
		}else{
			var link = req.body.link;
			var senderId = req.body.senderId;
			var temp_user = user
			temp_user.accounts.push({
				link : link,
				senderId : senderId
			})
			User.updateUser(temp_user, function(err,updated_user){
				if (err) throw err
				else {
					res.redirect('/accounts')
				}
			})
		}

	})
});

router.post('/removeOne', ensureAuthenticated, function(req, res){
    var senderId = req.body.senderId
    User.getUserById(req.session.passport.user, function(err, user){
        // console.log(user.accounts)
        var removedOne = []
        for (let index = 0; index < user.accounts.length; index++) {
            const element = user.accounts[index];
            if (element.senderId !=senderId) {
                removedOne.push(element)
            }
        }
        // console.log(removedOne)
        user.accounts = removedOne
        console.log(user)
        User.updateUser(user, function(err, updated_user){
            if(err) throw err;
            else{
				res.redirect('/accounts')
			}
        })
	})
})

module.exports = router;