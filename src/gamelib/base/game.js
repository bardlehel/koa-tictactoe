"use strict";

import _ from 'underscore';
import GameState from './gameState';
import Player from './player';

//private properties:
let _singleGameObject = Symbol();
let _singletonEnforcer = Symbol();
let _players = [];

class Game {
    constructor(enforcer, persistence) {
        if(enforcer != _singletonEnforcer) throw "Cannot construct singleton";
        this.gameState = new GameState(this, persistence);
    }

    static getInstance(persistence) {
        if(!this[_singleGameObject]) {
            this[_singleGameObject] = new Game(_singletonEnforcer, persistence);
        }
        return this[_singleGameObject];
    }

    startNewGame(numPlayers) {

        if(isNaN(numPlayers))
            throw new Error('numPlayers is NaN');
        if(numPlayers <= 0)
            throw new Error('numPlayers is not a valid value');

        //create objects for each player in game
        for(var i = 0; i != numPlayers; i++) {
            this[_players].push(new Player());
        }

        this.gameState.reset();
    };

    getPlayer(num) {
        return _.find(this[_players], ()=>this.playerCount == num);
    }

    setState(state, player, winner) {
        this.gameState.state = state;
        this.gameState.player = player;
        this.gameState.winner = winner;
        this.gameState.save();
    }

    doGameLogic() {

    }


};

export default Game;