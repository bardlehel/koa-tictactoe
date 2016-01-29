"use strict";

import GameState from './gameState';
import GamePlayers from './gamePlayers';

//private property keys:
let _persistence = Symbol();

class Game {
    constructor(numPlayers, persistence) {
        this[_persistence] = persistence;
        this.setup(numPlayers);
    }

    setup(numPlayers) {
        this.players = new GamePlayers(numPlayers, this[_persistence]);
        this.gameState = new GameState(this, this[_persistence]);
        this.gameState.reset();
    };

    getState() {
        return this.gameState.data;
    }

    getPlayerTurn() {
        return this.gameState.getPlayerTurn();
    }

    *setState(state, turn, winner) {
        this.gameState.data.state = state;
        this.gameState.data.turn = turn;
        this.gameState.data.winner = winner;
        yield this.gameState.save();
    }

    //must be overridden and defined by subclass
    *doGameLogicStep() {}
};

export default Game;