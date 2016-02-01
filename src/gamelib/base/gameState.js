"use strict";

import co from 'co';
import {Enum} from 'enumify';
import GameData from './gameData';

class STATE extends Enum {}
STATE.initEnum(
    [
        'NOT_STARTED',
        'WAITING_ON_PLAYER',
        'PLAYER_TURN',
        'GAME_OVER'
    ]);

const STATE_KEY = 'state';

class GameState extends GameData {

    constructor(gameInstance, persistence) {
        super(persistence, STATE_KEY);
        this.game = gameInstance;
        this.reset(false);
    }

    reset(save=true) {
        console.log('resetting game state...');
        this.data.state = STATE.NOT_STARTED;
        this.data.turn = 1;
        this.data.winner = null;

        if(save) {
            co(function*() {
                yield this.save();
                console.log('saved new game state');
            });
        }
    }

    *setPlayerTurn(player) {
        if(isNaN(player) || player < 0 || player >= this.game.TotalPlayers) {
            throw new Error('invalid player number');
        }

        this.data.state = STATE.PLAYER_TURN;
        this.data.turn = player;
        this.data.winner = null;
        yield this.save();
    }

    getPlayerTurn() {
        return this.data.turn;
    }

    //overrides

    *load() {
        console.log('base loading method starting...');
        yield super.load();
        console.log('gameState.data = ');
        console.log(this.data);
        //marshal state back to Enum
        console.log('marshaling state' + this.data.state + 'to enum');
        this.data.state = STATE.enumValueOf(this.data.state.name);
    }

    *save() {
        yield super.save();
    }
}

export default GameState;
export { STATE, STATE_KEY };
