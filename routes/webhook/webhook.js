var express = require('express');
var request = require('request');
var router = express.Router();
var User = require('../../models/user');
var invalid_account = require('../../models/invalid_account');
var Quick_replies_class = require('../../models/quick_replies/Quick_replies_class')
var create_quick_replies = require('../../models/quick_replies/create_quick_replies')



router.get('/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('Error, wrong token')
    }
})


router.post('/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging

    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id

        if (event.message && event.message.text) {
            let msg = event.message.text;
            var qr_cmd = new Quick_replies_class()
            qr_cmd.add_text_without_image('Lumière')
            qr_cmd.add_text_without_image('Caméra')
            qr_cmd.add_text_without_image('Porte')
            User.find({}, function (err, results) {
                let messageData;
                var user
                for (let i = 0; i < results.length; i++) {
                    const a = results[i];

                    for (let j = 0; j < a.accounts.length; j++) {
                        const b = a.accounts[j].senderId;
                        if (sender == b) {
                            user = a;
                            break;
                        }
                    }
                }
                if (user) {
                    if (event.message.quick_reply && event.message.quick_reply.payload) {
                        switch (event.message.quick_reply.payload) {
                            case "Lumière":
                                messageData = message_data_qr(qr_cmd, "Lumière séléctionné.\nSelectionner une autre commande")
                                break;

                            case "Caméra":
                                messageData = message_data_qr(qr_cmd, "Caméra séléctionné.\nSelectionner une autre commande")
                                break;

                            case "Porte":
                                messageData = message_data_qr(qr_cmd, "Porte séléctionné.\nSelectionner une autre commande")
                                break;
                        }
                    } else {
                        messageData = message_data_qr(qr_cmd, "Utilisateur : " + user.name + "\nSelectionner votre commande")

                    }
                } else {
                    messageData = invalid_account(sender, "https://10178f0c.ngrok.io")
                }

                sendMessageData(sender, messageData)
            })


        }
        if (event.postback) {
            let text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: " + text.substring(0, 200), token)
            continue
        }

    }
    res.sendStatus(200)
})

function sendMessageData(sender, msgData) {
    const token = "EAAXugd3QZAY4BAMbPL92jv8u7RBGPU822WqvPIEQpLgZCTYVLglBpZBGkZCGAk5ZBVecVJPGKQzwwpFbZBvvMi4iUQIXoZAVQBaGG9EWbRR2X6ZAAkf89pxLIR0PZAyT3ZB9FM29H3Db4PG6cpcVoaEUodzzY9nHZAg6WsiEtZC2aJq8DwZDZD"

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: token
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            message: msgData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
module.exports = router;

function message_data_qr(qr, message) {
    var msgdata = {
        "text": message,
        "quick_replies": create_quick_replies(qr)
    }
    return msgdata
}