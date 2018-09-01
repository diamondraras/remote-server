var moment = require('../../config/moment')
module.exports = function (accounts) {
    let results = []
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        let added_at = moment(account.added_at).fromNow()
        account.added_at = added_at
        results.push(account)
    }
    return results
}