const express = require('express');
const router = express.Router();
const userService = require('../user/user_service');
const authorize = require('../_helpers/authorize')
const Role = require('../_helpers/role');
const User = require("../models/User");

async function register(req, res, next){
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint to insert a user'
    /* #swagger.parameters['newUser'] = {
               in: 'body',
               description: 'Information about the user',
               required: true,
               schema: { $ref: "#/definitions/User" }
        } */
    try{
        console.log(req.body)
        const user = new User({
            username: req.body.username,
            password: req.body.password, //remember to stor password hashed
            role: req.body.role
        });
        const newUser = await user.save();
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/User" },
               description: 'insered user.' 
        } */
        res.status(200).json(newUser);

    } catch (err) {
        next(err);
    }
}

function authenticate(req, res, next) {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint to authenticate a user'
    /* #swagger.parameters['newUser'] = {
               in: 'body',
               description: 'Information about the user',
               required: true,
               schema: { $ref: "#/definitions/User" }
        } */
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint to get all users only Authenticated user is an admin'
    
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getByUsername(req, res, next) {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint to get all users only Authenticated users'
    // #swagger.params['username'] = {description: 'user username to search'}
    const currentUser = req.user;
    const username = req.params.username;

    // only allow admins to access other user records
    if (username !== currentUser.username && currentUser.role.type !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getByUsername(req.params.username)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}


// routes
router.post("/register", register);              //public route
router.post('/authenticate', authenticate);     // public route
router.get('/', authorize(Role.Admin), getAll); // admin only
router.get('/:username', authorize(), getByUsername);       // all authenticated users




module.exports = router;

