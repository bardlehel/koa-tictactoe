"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _gameState = require('./gameState');

var _gameState2 = _interopRequireDefault(_gameState);

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//private properties:
let _singleGameObject = Symbol();
let _singletonEnforcer = Symbol();
let _players = [];

class Game {
    constructor(enforcer, persistence) {
        if (enforcer != _singletonEnforcer) throw "Cannot construct singleton";
        this.gameState = new _gameState2.default(this, persistence);
    }

    static getInstance(persistence) {
        if (!this[_singleGameObject]) {
            this[_singleGameObject] = new Game(_singletonEnforcer, persistence);
        }
        return this[_singleGameObject];
    }

    startNewGame(numPlayers) {

        if (isNaN(numPlayers)) throw new Error('numPlayers is NaN');
        if (numPlayers <= 0) throw new Error('numPlayers is not a valid value');

        //create objects for each player in game
        for (var i = 0; i != numPlayers; i++) {
            this[_players].push(new _player2.default());
        }

        this.gameState.reset();
    }

    getPlayer(num) {
        return _underscore2.default.find(this[_players], () => this.playerCount == num);
    }

    setState(state, player, winner) {
        this.gameState.state = state;
        this.gameState.player = player;
        this.gameState.winner = winner;
        this.gameState.save();
    }

    doGameLogic() {}

};

exports.default = Game;