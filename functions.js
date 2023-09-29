const data = require("./data");

let id = 0;

function len() {
    return data.length;
}

function alreadyExist(username) {
    return data.some((user) => user.username === username);
}

exports.login = (username, password) => {
    const user = data.filter((user) => {
        return user.username === username && user.password === password
    })
    // console.log(user);
    if(user.length > 0) {
        return {user: user[0], error:null};
    }
    return {user: null, error: "Username or Password is Incorrect"};
}
exports.register = (username, password) => {
    const state = alreadyExist(username);
    if(state === true) {
        return {error: "User already exist"};
    }
    id++;
    let user = {id, username, password};
    let length = len();
    data[length] = user;
    console.log(data);
    return {user, error:null};
}