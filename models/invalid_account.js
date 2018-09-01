
function invalid_account(senderID,link) {


  var msgdata = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "SmartMinds : Ajouter votre compte ",
          "subtitle": "Cliquer ici et connectez-vous pour ajouter votre compte\nSenderID :"+senderID,
          "image_url": "https://picsum.photos/200/300/?random",
          "buttons": [{
            "type": "web_url",
            "url": link+"/accounts/add/"+senderID,
            "title": "Ajouter votre compte ici !"
          }],
        }]
      }
    }
  }


  return msgdata
}

module.exports = invalid_account
