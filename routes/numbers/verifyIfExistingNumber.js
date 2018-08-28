module.exports = function(user,num, type){

    switch (type) {
        case "home":
        for (let index = 0; index < user.numbers.home.length; index++) {
            const element = user.numbers.home[index];
            if (num == element.num) {
                return true;
            }
        }
            break;
        case "neighbours":
        for (let index = 0; index < user.numbers.neighbours.length; index++) {
            const element = user.numbers.neighbours[index];
            if (num == element.num) {
                return true;
            }
        }
            break;
    }
    return false;
}