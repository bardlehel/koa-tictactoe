"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _game = require('./base/game');

var _game2 = _interopRequireDefault(_game);

var _persistence2 = require('./base/persistence');

var _persistence3 = _interopRequireDefault(_persistence2);

var _checkerBoard = require('./base/checkerBoard');

var _checkerBoard2 = _interopRequireDefault(_checkerBoard);

var _gameState = require('./base/gameState');

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//private properties...
let _gameCounter = 0;
let _gameInstance = null;
let _persistence = Symbol();

class TicTacToeGame extends _game2.default {

    static get TOTAL_PLAYERS() {
        return 2;
    }
    static get BOARD_SIZE() {
        return 3;
    }
    static get SPECTATOR() {
        return -1;
    }
    static get PLAYER_ONE() {
        return 0;
    }
    static get PLAYER_TWO() {
        return TicTacToeGame.PLAYER_ONE + 1;
    }
    static get NO_WINNER() {
        return -1;
    }

    constructor(persistence) {

        if (++_gameCounter > 1) throw new Error("singleton object");

        if (!persistence) throw new Error("persistence object required!");

        super(TicTacToeGame.TOTAL_PLAYERS, persistence);

        this.persistence = persistence;

        let _this = this;

        persistence.connectCallback = function () {
            _this.setupGame(persistence);
            console.log('finished setting up TicTacToe.');
        };

        _gameInstance = this;
    }

    getIPAddressForPlayer(num) {
        if (isNaN(num) || num < 0 || num > 1) throw new Error('bad player number');
        return this.players.getPlayerByIndex(num).ipAddress;
    }

    setupGame(persistence) {
        this.board = new _checkerBoard2.default(TicTacToeGame.BOARD_SIZE, persistence);

        if (this.persistence.isMock) return;

        (0, _co2.default)(function* () {
            try {
                console.log('loading last saved match....');
                yield persistence.loadLastGameDocument();

                if (persistence.getGameData(_gameState.STATE_KEY).state == _gameState.STATE.GAME_OVER) {
                    console.log('last match finished.  creating new match in db...');
                    yield persistence.createNewGameDocument();
                    consol.log('new match document created');
                } else {
                    yield this.board.load();
                    yield this.players.load();
                    yield this.gameState.load();
                    console.log('successfully loaded last match data');
                }
            } catch (err) {
                console.log('error trying to load last match.  creating new game in db');
                yield persistence.createNewGameDocument();
                console.log('successfully created new match document');
            }
        });
    }

    *registerPlayer(ipAddr) {
        if (!ipAddr) throw new Error('no ipaddr supplied');

        if (this.players.hasJoined(ipAddr)) return;

        let joinedSize = this.players.numJoined;
        let player = null;

        if (joinedSize == 0) player = this.players.getPlayerByIndex(TicTacToeGame.PLAYER_ONE);else player = this.players.getPlayerByIndex(TicTacToeGame.PLAYER_TWO);

        player.ipAddress = ipAddr;

        yield this.players.save();
    }

    *setState(state) {
        let player = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        let winner = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        yield super.setState(state, player, winner);
    }

    getGameData() {
        let ret = {};

        ret.board = this.board.data.grid;
        ret.state = this.getState();

        switch (ret.state.state) {
            case _gameState.STATE.WAITING_ON_PLAYER:

                ret.message = "Waiting on Player 2...";
                break;
            case _gameState.STATE.PLAYER_TURN:

                if (ret.state.turn == TicTacToeGame.PLAYER_ONE) ret.message = "X to move!";else ret.message = "O to move!";
                break;
            case _gameState.STATE.GAME_OVER:

                if (ret.state.winner == TicTacToeGame.PLAYER_ONE) ret.message = "X wins!";else if (ret.state.winner == TicTacToeGame.PLAYER_TWO) ret.message = "O wins!";else ret.message = "Draw!";
                break;
        }

        return ret;
    }

    //return true if all squares are filled or 3-in-a-row exists
    isGameOver() {
        if (this.board.getFilledSquares() === Math.pow(TicTacToeGame.BOARD_SIZE, 2)) {
            return true;
        } else if (this.getWinner() !== TicTacToeGame.NO_WINNER) {
            return true;
        }

        return false;
    }

    getWinner() {

        for (let i = 0; i < 3; i++) {
            if (this.board.getSquareByXY(i, 0) !== null && this.board.getSquareByXY(i, 0) === this.board.getSquareByXY(i, 1) && this.board.getSquareByXY(i, 1) === this.board.getSquareByXY(i, 2)) {
                return this.board.getSquareByXY(i, 0);
            }
        }

        for (let i = 0; i < 3; i++) {
            if (this.board.getSquareByXY(0, i) !== null && this.board.getSquareByXY(0, i) === this.board.getSquareByXY(1, i) && this.board.getSquareByXY(1, i) === this.board.getSquareByXY(2, i)) {
                return this.board.getSquareByXY(0, i);
            }
        }

        if (this.board.getSquareByXY(0, 0) !== null && this.board.getSquareByXY(0, 0) === this.board.getSquareByXY(1, 1) && this.board.getSquareByXY(1, 1) === this.board.getSquareByXY(2, 2)) {
            return this.board.getSquareByXY(0, 0);
        }
        if (this.board.getSquareByXY(0, 2) !== null && this.board.getSquareByXY(0, 2) === this.board.getSquareByXY(1, 1) && this.board.getSquareByXY(1, 1) === this.board.getSquareByXY(2, 0)) {
            return this.board.getSquareByXY(0, 2);
        }

        return TicTacToeGame.NO_WINNER;
    }

    *doGameLogicStep() {
        switch (this.getState().state) {
            case _gameState.STATE.NOT_STARTED:

                if (this.players.numJoined > 0) {
                    yield this.setState(_gameState.STATE.WAITING_ON_PLAYER);
                }
                break;
            case _gameState.STATE.WAITING_ON_PLAYER:

                if (this.players.numJoined === 2) {
                    console.log('waiting for player, before setState');
                    yield this.gameState.setPlayerTurn(TicTacToeGame.PLAYER_ONE);
                }
                break;
            case _gameState.STATE.PLAYER_TURN:

                let playerOneTurnCount = this.board.getFilledSquares(TicTacToeGame.PLAYER_ONE);
                let playerTwoTurnCount = this.board.getFilledSquares(TicTacToeGame.PLAYER_TWO);

                if (this.getPlayerTurn() == TicTacToeGame.PLAYER_ONE && playerOneTurnCount > playerTwoTurnCount) {

                    if (this.isGameOver()) {
                        yield this.setState(_gameState.STATE.GAME_OVER, null, this.getWinner());
                        break;
                    }

                    yield this.gameState.setPlayerTurn(TicTacToeGame.PLAYER_TWO);
                } else if (this.getPlayerTurn() == TicTacToeGame.PLAYER_TWO && playerOneTurnCount === playerTwoTurnCount) {

                    if (this.isGameOver()) {
                        yield this.setState(_gameState.STATE.GAME_OVER, null, this.getWinner());
                        break;
                    }

                    yield this.gameState.setPlayerTurn(TicTacToeGame.PLAYER_ONE);
                }

                break;
            case _gameState.STATE.GAME_OVER:

                console.log('game ended.');
                process.exit();
                break;
            default:
                throw new Error('code should not be reached');
                break;
        };
    }
}

exports.default = TicTacToeGame;