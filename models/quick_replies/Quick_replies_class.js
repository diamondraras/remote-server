function Quick_replies_class() {
  this._quick_replies =[]

  this.add_text_without_image = function (title, payload) {
    var json = {}
    // console.log(payload)
    json['content_type'] = 'text'
    json['title'] = title
    json['payload'] = "<DEVELOPER_DEFINED_PAYLOAD>"
    this._quick_replies.push(json)
  }

  this.add_text_with_image = function (title ,payload, image_url) {
    var json = {}
    json['content_type'] = 'text'
    json['title'] = title
    json['payload'] = "<DEVELOPER_DEFINED_PAYLOAD>"
    json['image_url'] = image_url
    this._quick_replies.push(json)
  }
  this.add_location = function () {
    this._quick_replies.push({content_type : "location"})
  }
}

module.exports = Quick_replies_class
