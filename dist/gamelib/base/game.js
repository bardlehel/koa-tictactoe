"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _gameState = require('./gameState');

var _gameState2 = _interopRequireDefault(_gameState);

var _gamePlayers = require('./gamePlayers');

var _gamePlayers2 = _interopRequireDefault(_gamePlayers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//private property keys:
let _persistence = Symbol();

class Game {
    constructor(numPlayers, persistence) {
        this[_persistence] = persistence;
        this.setup(numPlayers);
    }

    setup(numPlayers) {
        this.players = new _gamePlayers2.default(numPlayers, this[_persistence]);
        this.gameState = new _gameState2.default(this, this[_persistence]);
        this.gameState.reset();
    }

    getState() {
        return this.gameState.data;
    }

    getPlayerTurn() {
        return this.gameState.getPlayerTurn();
    }

    *setState(state, turn, winner) {
        this.gameState.data.state = state;
        this.gameState.data.turn = turn;
        this.gameState.data.winner = winner;
        yield this.gameState.save();
    }

    //must be overridden and defined by subclass
    *doGameLogicStep() {}
};

exports.default = Game;