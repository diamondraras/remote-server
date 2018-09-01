var User = require('../../models/user');

module.exports = function (users, senderId) {
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        for (let j = 0; j < user.accounts.length; j++) {
            const element = user.accounts[j];
            if (senderId == element.senderId) {
                return true;
            }
        }
    }
    return false;
}