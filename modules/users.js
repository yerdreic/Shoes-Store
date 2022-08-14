const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    ownIdData: {
        type: String
    }
})

module.exports = mongoose.model('User', usersSchema)