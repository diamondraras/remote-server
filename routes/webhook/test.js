var express = require('express');
var router = express.Router();
var User = require('../../models/user');




router.get('/',function (req, res) {
    res.render("test")
})

router.post('/', function(req, res){
    var message = req.body.message;
    var senderId = req.body.senderId;
    User.find({},function(err,results){
        var users = []
        for (let i = 0; i < results.length; i++) {
            const a = results[i];
            
            for (let j = 0; j < a.accounts.length; j++) {
                const b = a.accounts[j].senderId;
                if (senderId == b) {
                    users.push(a);
                    break;
                }
            }
        }
        switch (users.length) {
            case 1:
                console.log("un utilisateur")
                res.render("test")
                break;
                case 0:
                console.log("aucun utilisateur")
                res.render('test')
                break;
                
                default:
                console.log("plusieurs utilisateur")
                res.render("test")
                break;
        }
        // on gère ici le cas où il y a plusieurs compte et le cas ou il n'y en a pas
    })
    
})


module.exports = router;