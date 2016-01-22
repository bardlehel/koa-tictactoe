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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TOTAL_PLAYERS = 2;
const BOARD_SIZE = 3;
const PLAYER_ONE = 0;
const PLAYER_TWO = PLAYER_ONE + 1;
const NO_WINNER = -1;

let _gameSymbol = Symbol();
let _singletonEnforcer = Symbol();

class TicTacToeGame extends _game2.default {

    constructor(enforcer, persistence) {
        super(enforcer, persistence);
    }

    static getInstance(persistence) {
        if (!this[_gameSymbol]) this[_gameSymbol] = new TicTacToeGame(_singletonEnforcer, persistence);
        return this[_gameSymbol];
    }

    getIPAddressForPlayer(num) {
        if (isNaN(num) || num < 1) throw new Error('bad player number');
        return super.getPlayer(num).ipAddress;
    }

    setupGame(connURI) {
        this.joinedPlayers = new Map();
        this.gameState = new PersistentGameState(this, connURI);
        this.board = new _checkerBoard2.default(this.BOARD_SIZE);
        super.startNewGame(this.TOTAL_PLAYERS);
    }

    onPlayerJoin(ipAddr) {
        if (this.joinedPlayers.has(ipAddr)) return;
        let joinedSize = this.joinedPlayers.size;
        var player = super.getPlayer(joinedSize);
        player.ipAddress = ipAddr;
        this.joinedPlayers.set(ipAddr, player);
    }

    setState(state) {
        let player = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        let winner = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        super.setState(state, player, winner);
    }

    //return true if all squares are filled or 3-in-a-row exists
    isGameOver() {
        if (this.board.getFilledSquares() == BOARD_SIZE ^ 2) {
            return true;
        } else if (this.getWinner() != NO_WINNER) {
            return true;
        }

        return false;
    }

    getWinner() {
        let winner = NO_WINNER;

        for (let i = 0; i < 3; i++) if (this.board.getSquare(i, 0) === this.board.getSquare(i, 1) && this.board.getSquare(i, 1) === this.board.getSquare(i, 2)) ;
        winner = this.board.getSquare(i, 0);

        for (let i = 0; i < 3; i++) if (this.board.getSquare(0, i) === this.board.getSquare(1, i) && this.board.getSquare(1, i) === this.board.getSquare(2, i)) winner = this.board.getSquare(0, i);

        if (this.board.getSquare(0, 0) === this.board.getSquare(1, 1) && this.board.getSquare(1, 1) === this.board.getSquare(2, 2) || this.board.getSquare(0, 2) === this.board.getSquare(1, 1) && this.board.getSquare(1, 1) === this.board.getSquare(2, 0)) winner = this.board.getSquare(1, 1);

        return winner;
    }

    doGameLogic() {
        switch (this.gameState.state) {
            case _checkerBoard2.default.NOT_STARTED:
                if (this.joinedPlayers.size > 0) {
                    this.setState(_checkerBoard2.default.WAITING_ON_PLAYER);
                }
                break;
            case _checkerBoard2.default.WAITING_ON_PLAYER:
                if (this.joinedPlayers.size === 2) {
                    this.setState(_checkerBoard2.default.PLAYER_TURN, PLAYER_ONE);
                }
                break;
            case _checkerBoard2.default.PLAYER_TURN:
                let playerOneTurnCount = this.board.getFilledSquares(PLAYER_ONE);
                let playerTwoTurnCount = this.board.getFilledSquares(PLAYER_TWO);
                if (this.gameState.getPlayerTurn() == PLAYER_ONE && playerOneTurnCount > playerTwoTurnCount) {

                    //check if game is over?
                    if (this.isGameOver()) {
                        this.setState(_checkerBoard2.default.GAME_OVER, null, this.getWinner());
                        break;
                    }

                    this.setState(_checkerBoard2.default.PLAYER_TURN, PLAYER_TWO);
                } else if (this.gameState.getPlayerTurn() == PLAYER_TWO && playerOneTurnCount === playerTwoTurnCount) {

                    //check if game is over?
                    if (this.isGameOver()) {
                        this.setState(_checkerBoard2.default.GAME_OVER, null, this.getWinner());
                        break;
                    }

                    this.setState(_checkerBoard2.default.PLAYER_TURN, PLAYER_ONE);
                }
                break;
            case _checkerBoard2.default.GAME_OVER:

                break;
            default:
                throw new Error('code should not be reached');
                break;
        };
    }
}

exports.default = TicTacToeGame;