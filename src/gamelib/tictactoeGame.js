"use strict";

import Game from 'base/game';
import PersistentGameState from 'persistentGameState';
import CheckerBoard from 'checkerBoard';
import STATE from 'checkerBoard';

const TOTAL_PLAYERS = 2;
const BOARD_SIZE = 3;
const PLAYER_ONE = 0;
const PLAYER_TWO = PLAYER_ONE + 1;
const NO_WINNER = -1;

class TicTacToeGame extends Game {

    get instance() {
        return super.instance;
    }

    getIPAddressForPlayer(num) {
        if(isNaN(num) || num < 1) throw new Error('bad player number');
        return getPlayer(num).ipAddress;
    }



    setupGame(connURI) {
        this.joinedPlayers = new Map();
        this.gameState = new PersistentGameState(this, connURI);
        this.board = new CheckerBoard(this.BOARD_SIZE);
        this.filledSquares = 0;
        super.startNewGame(this.TOTAL_PLAYERS);
    }

    playerJoin(ipAddr) {
        if (this.joinedPlayers.has(ipAddr)) return;
        let joinedSize = this.joinedPlayers.size;
        var player = super.getPlayer(joinedSize);
        player.ipAddress = ipAddr;
        this.joinedPlayers.set(ipAddr, player);
    }

    setState(state, player=null, winner=null) {
        super.setState(state, player, winner);
        this.gameState.saveGame();
    }

    //return true if all squares are filled or 3-in-a-row exists
    isGameOver() {
        if (this.board.getFilledSquares() == BOARD_SIZE ^ 2) {
            return true;
        } else if (getWinner() != NO_WINNER) {
            return true;
        }

        return false;
    }

    getWinner() {
        var winner = NO_WINNER;

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

    doGameLogic() {
        switch(this.gameState.state) {
            case STATE.NOT_STARTED:
                if(this.joinedPlayers.size > 0) {
                    this.setState(STATE.WAITING_ON_PLAYER);
                }
                break;
            case STATE.WAITING_ON_PLAYER:
                if(this.joinedPlayers.size === 2) {
                    this.setState(STATE.PLAYER_TURN, PLAYER_ONE);
                }
                break;
            case STATE.PLAYER_TURN:
                let playerOneTurnCount = this.board.getFilledSquares(PLAYER_ONE);
                let playerTwoTurnCount = this.board.getFilledSquares(PLAYER_TWO);
                if (this.gameState.getPlayerTurn() == PLAYER_ONE
                    && playerOneTurnCount > playerTwoTurnCount) {

                    //check if game is over?
                    if (this.isGameOver()) {
                        this.setState(STATE.GAME_OVER, null, this.getWinner());
                        break;
                    }

                    this.setState(STATE.PLAYER_TURN, PLAYER_TWO);
                } else if (this.gameState.getPlayerTurn() == PLAYER_TWO
                    && playerOneTurnCount === playerTwoTurnCount) {

                    //check if game is over?
                    if (this.isGameOver()) {
                        this.setState(STATE.GAME_OVER, null, this.getWinner());
                        break;
                    }

                    this.setState(STATE.PLAYER_TURN, PLAYER_ONE);
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