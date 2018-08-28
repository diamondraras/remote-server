var User = require('../models/user');

exports = module.exports = function (io) {
    io.sockets.on('connection', function (socket) {
        console.log("Un client est connecté")
        socket.on('socket_init',function(data){
            // console.log(socket)
            // User.getUserByEmail(data.email,function (err, user) {
                
            //     tab = []
            //     tab.push(socket)
            //     console.log(tab)
            //     user.socket = tab
            //     // console.log(user)
            //     User.updateUser(user, function (err, updated_user) {
            //         if (err) throw err
            //         else console.log(updated_user)
            //     })
            // })
        })
    });
  }
  