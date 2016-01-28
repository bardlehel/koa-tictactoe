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
let _players = Symbol();
let _totalPlayers = Symbol();
let _persistence = Symbol();

class Game {
    constructor(persistence) {
        this.gameState = new _gameState2.default(this, persistence);
    }

    createNewGame(numPlayers) {

        if (isNaN(numPlayers)) throw new Error('numPlayers is NaN');
        if (numPlayers <= 0) throw new Error('numPlayers is not a valid value');

        this[_players] = [];
        //create objects for each player in game
        for (var i = 0; i != numPlayers; i++) {
            this[_players].push(new _player2.default());
        }

        this[_totalPlayers] = numPlayers;

        this.gameState.reset();
    }

    getPlayerByCount(playerCount) {
        if (playerCount < 1) throw new Error('plq');

        return _underscore2.default.find(this[_players], () => this.playerCount == playerCount);
    }

    getPlayerByIndex(n) {
        if (n < 0) throw new Error('plq');

        return this[_players][n];
    }

    get Players() {
        return this[_players];
    }

    get TotalPlayers() {
        return this[_totalPlayers];
    }

    getState() {
        return this.gameState.data;
    }

    getPlayerTurn() {
        return this.gameState.getPlayerTurn();
    }

    setState(state, turn, winner) {
        this.gameState.data.state = state;
        this.gameState.data.turn = turn;
        this.gameState.data.winner = winner;
        this.gameState.save();
    }

    doGameLogicStep() {}

};

exports.default = Game;