"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _game = require('./base/game');

var _game2 = _interopRequireDefault(_game);

var _persistence = require('./base/persistence');

var _persistence2 = _interopRequireDefault(_persistence);

var _checkerBoard = require('./base/checkerBoard');

var _checkerBoard2 = _interopRequireDefault(_checkerBoard);

var _gameState = require('./base/gameState');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//private properties...
let _gameCounter = 0;
let _gameInstance = null;

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
        this.setupGame(persistence);
        _gameInstance = this;
    }

    static get gameInstance() {
        return _gameInstance;
    }


    *lastGameUnfinished(persistence) {
        try {
            yield persistence.loadLastGameDocument();
        } catch (err) {
            return false;
        }

        if (persistence.loadGameData('state').state != _gameState.STATE.GAME_OVER) return true;

        return false;
    }

    getIPAddressForPlayer(num) {
        if (isNaN(num) || num < 0 || num > 1) throw new Error('bad player number');
        return super.getPlayerByIndex(num).ipAddress;
    }

    setupGame(persistence) {
        this.joinedPlayers = new Map();
        this.board = new _checkerBoard2.default(TicTacToeGame.BOARD_SIZE, persistence);

        if (!this.loadLastGameIfUnfinished(persistence)) {
            persistence.createNewGameDocument();
            //super.createNewGame(TicTacToeGame.TOTAL_PLAYERS);
        }
    }

    registerPlayer(ipAddr) {
        if (!ipAddr) throw new Error('no ipaddr supplied');

        if (this.joinedPlayers.has(ipAddr)) return;

        let joinedSize = this.joinedPlayers.size;
        let player = null;

        if (joinedSize == 0) player = super.getPlayerByIndex(TicTacToeGame.PLAYER_ONE);else player = super.getPlayerByIndex(TicTacToeGame.PLAYER_TWO);

        player.ipAddress = ipAddr;
        this.joinedPlayers.set(ipAddr, player);
    }

    setState(state) {
        let player = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        let winner = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        super.setState(state, player, winner);
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
                console.log('turn = ' + ret.state.turn);
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

    doGameLogicStep() {
        switch (this.getState().state) {
            case _gameState.STATE.NOT_STARTED:
                if (this.joinedPlayers.size > 0) {
                    this.setState(_gameState.STATE.WAITING_ON_PLAYER);
                }
                break;
            case _gameState.STATE.WAITING_ON_PLAYER:
                if (this.joinedPlayers.size === 2) {
                    this.setState(_gameState.STATE.PLAYER_TURN, TicTacToeGame.PLAYER_ONE);
                }
                break;
            case _gameState.STATE.PLAYER_TURN:
                let playerOneTurnCount = this.board.getFilledSquares(TicTacToeGame.PLAYER_ONE);
                let playerTwoTurnCount = this.board.getFilledSquares(TicTacToeGame.PLAYER_TWO);

                if (this.getPlayerTurn() == TicTacToeGame.PLAYER_ONE && playerOneTurnCount > playerTwoTurnCount) {
                    if (this.isGameOver()) {
                        this.setState(_gameState.STATE.GAME_OVER, null, this.getWinner());
                        break;
                    }

                    this.setState(_gameState.STATE.PLAYER_TURN, TicTacToeGame.PLAYER_TWO);
                } else if (this.getPlayerTurn() == TicTacToeGame.PLAYER_TWO && playerOneTurnCount === playerTwoTurnCount) {
                    if (this.isGameOver()) {
                        this.setState(_gameState.STATE.GAME_OVER, null, this.getWinner());
                        break;
                    }

                    this.setState(_gameState.STATE.PLAYER_TURN, TicTacToeGame.PLAYER_ONE);
                }

                break;
            case _gameState.STATE.GAME_OVER:

                break;
            default:
                throw new Error('code should not be reached');
                break;
        };
    }
}

exports.default = TicTacToeGame;