"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongoose3 = require("mongoose.Schema");

var _mongoose4 = _interopRequireDefault(_mongoose3);

var _mongoose5 = require("mongoose.Document");

var _mongoose6 = _interopRequireDefault(_mongoose5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TicTacToeDataSchema = new _mongoose4.default({
    state: String,
    player: Number,
    winner: Number,
    started: Date
});

exports.default = _mongoose2.default.model('TicTacToeData', TicTacToeDataSchema);