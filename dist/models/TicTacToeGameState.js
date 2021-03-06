"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TicTacToeDataSchema = new _mongoose.Schema({
    board: Array,
    players: Array,
    state: Object, //fix
    //turn: Number,
    //winner: Number,
    started: Date
});

exports.default = _mongoose2.default.model('TicTacToeData', TicTacToeDataSchema);