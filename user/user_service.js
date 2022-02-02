const config = require('../config.json');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../_helpers/role');

async function getAllNoPw(){
    try {
        const users = await User.find(); //return all users
        //console.log(users)
        return users;

    } catch (err) {
        console.log(err);
    }
}

const usersPromise = Promise.resolve(getAllNoPw());
const users = Array();
usersPromise.then(u => {    
   u.forEach(element => {
       users.push(element);
   }); 
});

// users hardcoded for simplicity, store in a db for production applications
/* [
    { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin },
    { id: 2, username: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.User }
]; */

module.exports = {
    authenticate,
    getAll,
    getByUsername
};

async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ username: user.username, role: user.role.type }, config.secret);
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token
        };
    }
}

async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

async function getByUsername(username) {
    const user = users.find(u => u.username === username);
    if (!user) return;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}