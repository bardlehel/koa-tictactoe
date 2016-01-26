"use strict";

import _ from 'underscore';
import GameState from './gameState';
import Player from './player';

//private properties:
let _players = Symbol();
let _totalPlayers = Symbol();

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

    getPlayerByCount(playerCount) {
        if(playerCount < 1)
            throw new Error('plq');

        return _.find(this[_players], ()=>this.playerCount == playerCount);
    }

    getPlayerByIndex(n) {
        if(n < 0)
            throw new Error('plq');

        return this[_players][n];
    }

    get Players() {
        return this[_players];
    }

    getState() {
        return this.gameState.data;
    }

    setState(state, turn, winner) {
        this.gameState.data.state = state;
        this.gameState.data.turn = turn;
        this.gameState.data.winner = winner;
        this.gameState.save();
    }

    doGameLogicStep() {

    }


};

export default Game;