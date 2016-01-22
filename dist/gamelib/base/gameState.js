"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.STATE = undefined;

var _enum = require("enum");

var _enum2 = _interopRequireDefault(_enum);

var _gameData = require("./gameData");

var _gameData2 = _interopRequireDefault(_gameData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_enum2.default.register();

const STATE = new _enum2.default('NOT_STARTED', 'WAITING_ON_PLAYER', 'PLAYER_TURN', 'PLAYER_FINISHED_TURN', 'GAME_OVER');

class GameState extends _gameData2.default {

    constructor(gameInstance, persistence) {
        super(persistence);
        this.game = gameInstance;
        reset();
    }

    reset() {
        this.data.state = this.STATE.NOT_STARTED;
        this.data.turn = 1;
        this.data.winner = null;
        this.save();
    }

    setPlayerTurn(player) {
        if (isNan(player) || player < 1 || player > this.game.PlayerCount) {
            throw new Error('invalid player number');
        }

        this.state = this.STATE.PLAYER_TURN;
        this.turn = player;
        this.save();
    }

    getPlayerTurn() {
        return this.turn;
    }

}

exports.default = GameState;
exports.STATE = STATE;