module.exports = function(user,senderId){
    for (let index = 0; index < user.accounts.length; index++) {
        const element = user.accounts[index];
        if (senderId == element.senderId) {
            return true;
        }
    }
    return false;
}