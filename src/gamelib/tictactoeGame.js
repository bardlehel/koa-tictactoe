"use strict";

import Game from './base/game';
import Persistence from './base/persistence';
import CheckerBoard from './base/checkerBoard';
import {STATE, STATE_KEY} from './base/gameState';
import co from 'co';

//private properties...
let _gameCounter = 0;
let _gameInstance = null;

class TicTacToeGame extends Game {

    static get TOTAL_PLAYERS() { return 2; }
    static get BOARD_SIZE() { return 3; }
    static get SPECTATOR() { return -1; }
    static get PLAYER_ONE() { return 0; }
    static get PLAYER_TWO() { return TicTacToeGame.PLAYER_ONE + 1; }
    static get NO_WINNER() { return -1; }

    constructor(persistence) {

        if(++_gameCounter > 1)
           throw new Error("singleton object");

        if(!persistence)
            throw new Error("persistence object required!");

        super(TicTacToeGame.TOTAL_PLAYERS, persistence);
        this.setupGame(persistence);
        _gameInstance = this;
    }

    getIPAddressForPlayer(num) {
        if(isNaN(num) || num < 0 || num > 1) throw new Error('bad player number');
        return this.players.getPlayerByIndex(num).ipAddress;
    }

    setupGame(persistence) {
        this.board = new CheckerBoard(TicTacToeGame.BOARD_SIZE, persistence);

        co(function*() {
            try {
                yield persistence.loadLastGameDocument();
                if(persistence.getGameData(STATE_KEY).state == STATE.GAME_OVER)
                    yield persistence.createNewGameDocument();
                else {
                    yield this.board.load();
                    yield this.players.load();
                    yield this.gameState.load();
                }

            } catch(err) {
                yield persistence.createNewGameDocument();
            }
        });
    }

    registerPlayer(ipAddr) {
        if(!ipAddr)
            throw new Error('no ipaddr supplied');

        if (this.players.hasJoined(ipAddr)) return;

        let joinedSize = this.players.numJoined;
        let player = null;

        if(joinedSize == 0)
            player = this.players.getPlayerByIndex(TicTacToeGame.PLAYER_ONE);
        else
            player = this.players.getPlayerByIndex(TicTacToeGame.PLAYER_TWO);

        player.ipAddress = ipAddr;
    }

    *setState(state, player=null, winner=null) {
        yield super.setState(state, player, winner);
    }

    getGameData() {
        let ret = {};

        ret.board = this.board.data.grid;
        ret.state = this.getState();

        switch(ret.state.state) {
            case STATE.WAITING_ON_PLAYER:
                ret.message = "Waiting on Player 2...";
                break;
            case STATE.PLAYER_TURN:
                console.log('turn = ' + ret.state.turn);
                if(ret.state.turn == TicTacToeGame.PLAYER_ONE)
                    ret.message = "X to move!";
                else
                    ret.message = "O to move!";
                break;
            case STATE.GAME_OVER:
                if(ret.state.winner == TicTacToeGame.PLAYER_ONE)
                    ret.message = "X wins!";
                else if (ret.state.winner == TicTacToeGame.PLAYER_TWO)
                    ret.message = "O wins!";
                else
                    ret.message = "Draw!";
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
            if (this.board.getSquareByXY(i, 0) !== null
                && this.board.getSquareByXY(i, 0) === this.board.getSquareByXY(i, 1)
                && this.board.getSquareByXY(i, 1) === this.board.getSquareByXY(i, 2)) {
                return this.board.getSquareByXY(i, 0);
            }

        }

        for (let i = 0; i < 3; i++) {
            if (this.board.getSquareByXY(0, i) !== null
                && this.board.getSquareByXY(0, i) === this.board.getSquareByXY(1, i)
                && this.board.getSquareByXY(1, i) === this.board.getSquareByXY(2, i)) {
                return this.board.getSquareByXY(0, i);
            }

        }

        if (this.board.getSquareByXY(0, 0) !== null
            && (this.board.getSquareByXY(0, 0) === this.board.getSquareByXY(1, 1)
            &&  this.board.getSquareByXY(1, 1)  ===  this.board.getSquareByXY(2, 2))) {
            return this.board.getSquareByXY(0, 0);
        }
        if (this.board.getSquareByXY(0, 2) !== null
            && this.board.getSquareByXY(0, 2) ===  this.board.getSquareByXY(1, 1)
            &&  this.board.getSquareByXY(1, 1)  ===  this.board.getSquareByXY(2, 0) )  {
                return this.board.getSquareByXY(0, 2);
        }

       return TicTacToeGame.NO_WINNER;

    }

    *doGameLogicStep() {
        switch(this.getState().state) {
            case STATE.NOT_STARTED:
                if(this.players.numJoined > 0) {
                    yield this.setState(STATE.WAITING_ON_PLAYER);
                }
                break;
            case STATE.WAITING_ON_PLAYER:
                if(this.players.numJoined === 2) {
                    yield this.setState(STATE.PLAYER_TURN, TicTacToeGame.PLAYER_ONE);
                }
                break;
            case STATE.PLAYER_TURN:
                let playerOneTurnCount = this.board.getFilledSquares(TicTacToeGame.PLAYER_ONE);
                let playerTwoTurnCount = this.board.getFilledSquares(TicTacToeGame.PLAYER_TWO);

                if (this.getPlayerTurn() == TicTacToeGame.PLAYER_ONE
                    && playerOneTurnCount > playerTwoTurnCount) {
                    if (this.isGameOver()) {
                        yield this.setState(STATE.GAME_OVER, null, this.getWinner());
                        break;
                    }

                    this.gameState.setPlayerTurn(TicTacToeGame.PLAYER_TWO);

                } else if (this.getPlayerTurn() == TicTacToeGame.PLAYER_TWO
                    && playerOneTurnCount === playerTwoTurnCount) {
                    if (this.isGameOver()) {
                        yield this.setState(STATE.GAME_OVER, null, this.getWinner());
                        break;
                    }

                    yield this.gameState.setPlayerTurn(TicTacToeGame.PLAYER_ONE);
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