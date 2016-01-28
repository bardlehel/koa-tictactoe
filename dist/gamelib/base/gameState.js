"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.STATE = undefined;

var _enumify = require('enumify');

var _gameData = require('./gameData');

var _gameData2 = _interopRequireDefault(_gameData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class STATE extends _enumify.Enum {}
STATE.initEnum(['NOT_STARTED', 'WAITING_ON_PLAYER', 'PLAYER_TURN', 'GAME_OVER']);

class GameState extends _gameData2.default {

    constructor(gameInstance, persistence) {
        super(persistence);
        this.game = gameInstance;
        this.reset();
    }

    reset() {
        this.data.state = STATE.NOT_STARTED;
        this.data.turn = 1;
        this.data.winner = null;
        this.save();
    }

    setPlayerTurn(player) {
        if (isNan(player) || player < 1 || player > this.game.TotalPlayers) {
            throw new Error('invalid player number');
        }

        this.data.state = STATE.PLAYER_TURN;
        this.data.turn = player;
        this.save();
    }

    getPlayerTurn() {
        return this.data.turn;
    }

}

exports.default = GameState;
exports.STATE = STATE;