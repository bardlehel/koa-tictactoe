"use strict";

import _ from 'underscore';
import GameState from './gameState';
import Player from './player';

//private properties:
let _players = [];

class Game {
    constructor(persistence) {
        this.gameState = new GameState(this, persistence);
    }

    createNewGame(numPlayers) {

        if(isNaN(numPlayers))
            throw new Error('numPlayers is NaN');
        if(numPlayers <= 0)
            throw new Error('numPlayers is not a valid value');

        this[_players] = [];
        //create objects for each player in game
        for(var i = 0; i != numPlayers; i++) {
            this[_players].push(new Player());
        }

        this.gameState.reset();
    };

    getPlayer(num) {
        return _.find(this[_players], ()=>this.playerCount == num);
    }

    getState() {
        return {
            state: this.gameState.state,
            playerTurn: this.gameState.player,
            winner: this.gameState.winner
        };
    }

    setState(state, player, winner) {
        this.gameState.state = state;
        this.gameState.player = player;
        this.gameState.winner = winner;
        this.gameState.save();
    }

    doGameLogicStep() {

    }


};

export default Game;