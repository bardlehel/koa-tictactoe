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
        this.data.state = STATE.NOT_STARTED;
        this.data.turn = 1;
        this.data.winner = null;

        if(save) {
            co(function*() {
                yield this.save();
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
        yield super.load();

        //marshal state back to Enum
        let enumName = this.data.stateName;
        this.data.state = STATE.enumValueOf(enumName);
    }

    *save() {
        this.data.stateName = this.data.state.name;

        yield super.save();
    }
}

export default GameState;
export { STATE, STATE_KEY };
