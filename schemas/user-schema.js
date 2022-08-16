const { mongoose } = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    id: mongoose.Types.Decimal128,
    emeralds: {
        type: Number,
        default: 0
    },
    stone: {
        type: Number,
        default: 0
    },
    iron: {
        type: Number,
        default: 0
    },
    gold: {
        type: Number,
        default: 0
    },
    diamonds: {
        type: Number,
        default: 0
    },
    amethyst: {
        type: Number,
        default: 0
    },

});

module.exports = { userSchema };