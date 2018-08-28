var Quick_replies_class = require('./Quick_replies_class')

function create_quick_reply(qr) {
  var quick_replies = []
  var current_json = {}
  for (var i = 0; i < qr._quick_replies.length; i++) {
    if (qr._quick_replies[i]['content_type'] == "location") {
      current_json['content_type'] = qr._quick_replies[i]['content_type']
    }else {
      current_json['content_type'] = qr._quick_replies[i]['content_type']
      current_json['title'] = qr._quick_replies[i]['title']
      current_json['payload'] = qr._quick_replies[i]['title']
      if (qr._quick_replies[i]['image_url']) {
        current_json['image_url'] = qr._quick_replies[i]['image_url']
      }
    }
    quick_replies.push(current_json)
    current_json = {}
  }
  return quick_replies
}

module.exports = create_quick_reply
