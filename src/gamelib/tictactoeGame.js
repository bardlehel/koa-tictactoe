"use strict";

import Game from './base/game';
import Persistence from './base/persistence';
import CheckerBoard from './base/checkerBoard';
import {STATE} from './base/gameState';

//private properties...
let _gameCounter = 0;

class TicTacToeGame extends Game {

    static get TOTAL_PLAYERS() { return 2; }
    static get BOARD_SIZE() { return 3; }
    static get PLAYER_ONE() { return 0; }
    static get PLAYER_TWO() { return TicTacToeGame.PLAYER_ONE + 1; }
    static get NO_WINNER() { return -1; }

    constructor(persistence) {

        if(++_gameCounter > 1)
           throw new Error("singleton object");

        super(persistence);
        this.setupGame();
    }

    getIPAddressForPlayer(num) {
        if(isNaN(num) || num < 0 || num > 1) throw new Error('bad player number');
        return super.getPlayer(num).ipAddress;
    }

    setupGame() {
        this.joinedPlayers = new Map();
        this.board = new CheckerBoard(TicTacToeGame.BOARD_SIZE);
        super.createNewGame(TicTacToeGame.TOTAL_PLAYERS);
    }

    registerPlayer(ipAddr) {
        if (this.joinedPlayers.has(ipAddr)) return;

        let joinedSize = this.joinedPlayers.size;
        var player = super.getPlayer(joinedSize);

        player.ipAddress = ipAddr;
        this.joinedPlayers.set(ipAddr, player);
    }

    setState(state, player=null, winner=null) {
        super.setState(state, player, winner);
    }

    getGameData() {
        let ret = {};

        ret.board = this.board.data.grid;
        ret.state = super.getState();

        return ret;
    }

    //return true if all squares are filled or 3-in-a-row exists
    isGameOver() {
        if (this.board.getFilledSquares() == TicTacToeGame.BOARD_SIZE ^ 2) {
            return true;
        } else if (this.getWinner() != TicTacToeGame.NO_WINNER) {
            return true;
        }

        return false;
    }

    getWinner() {
        let winner = TicTacToeGame.NO_WINNER;

        for (let i = 0; i < 3; i++)
        if (this.board.getSquare(i,0) === this.board.getSquare(i,1)
            && this.board.getSquare(i,1) === this.board.getSquare(i,2));
        winner = this.board.getSquare(i,0);

        for (let i = 0; i < 3; i++)
        if (this.board.getSquare(0, i) === this.board.getSquare(1, i)
            && this.board.getSquare(1, i) === this.board.getSquare(2, i))
        winner = this.board.getSquare(0, i);

        if ((this.board.getSquare(0, 0) === this.board.getSquare(1, 1)
            &&  this.board.getSquare(1, 1)  ===  this.board.getSquare(2, 2))
                || ( this.board.getSquare(0, 2) ===  this.board.getSquare(1, 1)
            &&  this.board.getSquare(1, 1)  ===  this.board.getSquare(2, 0) ))
        winner =  this.board.getSquare(1, 1);

        return winner;
    }

    doGameLogicStep() {
        switch(this.gameState.state) {
            case STATE.NOT_STARTED:
                if(this.joinedPlayers.size > 0) {
                    this.setState(STATE.WAITING_ON_PLAYER);
                }
                break;
            case STATE.WAITING_ON_PLAYER:
                if(this.joinedPlayers.size === 2) {
                    this.setState(STATE.PLAYER_TURN, TicTacToeGame.PLAYER_ONE);
                }
                break;
            case STATE.PLAYER_TURN:
                let playerOneTurnCount = this.board.getFilledSquares(TicTacToeGame.PLAYER_ONE);
                let playerTwoTurnCount = this.board.getFilledSquares(TicTacToeGame.PLAYER_TWO);
                if (this.gameState.getPlayerTurn() == TicTacToeGame.PLAYER_ONE
                    && playerOneTurnCount > playerTwoTurnCount) {

                    //check if game is over?
                    if (this.isGameOver()) {
                        this.setState(STATE.GAME_OVER, null, TicTacToeGame.getWinner());
                        break;
                    }

                    this.setState(STATE.PLAYER_TURN, TicTacToeGame.PLAYER_TWO);
                } else if (this.gameState.getPlayerTurn() == TicTacToeGame.PLAYER_TWO
                    && playerOneTurnCount === playerTwoTurnCount) {

                    //check if game is over?
                    if (this.isGameOver()) {
                        this.setState(STATE.GAME_OVER, null, this.getWinner());
                        break;
                    }

                    this.setState(STATE.PLAYER_TURN, TicTacToeGame.PLAYER_ONE);
                }
                break;
            case STATE.GAME_OVER:

                break;
            default:
                throw new Error('code should not be reached');
                break;
        };
    }
}

export default TicTacToeGame;