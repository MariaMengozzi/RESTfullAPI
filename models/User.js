const mongoose = require('mongoose');
const Role = require('../_helpers/role');

const UsersSchema = mongoose.Schema({
    //id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin }
    username:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    role:{
        type:{
            type: String, 
            enum: Object.values(Role), //list of possible role
            required: true
        }
    }

});


module.exports = mongoose.model('Users', UsersSchema);