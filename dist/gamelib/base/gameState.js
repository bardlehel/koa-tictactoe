"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.STATE_KEY = exports.STATE = undefined;

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

var _enumify = require('enumify');

var _gameData = require('./gameData');

var _gameData2 = _interopRequireDefault(_gameData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class STATE extends _enumify.Enum {}
STATE.initEnum(['NOT_STARTED', 'WAITING_ON_PLAYER', 'PLAYER_TURN', 'GAME_OVER']);

const STATE_KEY = 'state';

class GameState extends _gameData2.default {

    constructor(gameInstance, persistence) {
        super(persistence, STATE_KEY);
        this.game = gameInstance;
        this.reset(false);
    }

    reset() {
        let save = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

        console.log('resetting game state...');
        this.data.state = STATE.NOT_STARTED;
        this.data.turn = 1;
        this.data.winner = null;

        if (save) {
            (0, _co2.default)(function* () {
                yield this.save();
                console.log('saved new game state');
            });
        }
    }

    *setPlayerTurn(player) {
        if (isNaN(player) || player < 0 || player >= this.game.TotalPlayers) {
            throw new Error('invalid player number');
        }

        this.data.state = STATE.PLAYER_TURN;
        this.data.turn = player;
        this.data.winner = null;
        yield this.save();
    }

    getPlayerTurn() {
        return this.data.turn;
    }

    //overrides

    *load() {
        console.log('base loading method starting...');
        yield super.load();
        console.log('gameState.data = ');
        console.log(this.data);
        //marshal state back to Enum
        console.log('marshaling state' + this.data.state + 'to enum');
        this.data.state = STATE.enumValueOf(this.data.state.name);
    }

    *save() {
        yield super.save();
    }
}

exports.default = GameState;
exports.STATE = STATE;
exports.STATE_KEY = STATE_KEY;