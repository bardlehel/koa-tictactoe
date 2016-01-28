"use strict";

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
        this.reset();
    }

    reset() {
        this.data.state = STATE.NOT_STARTED;
        this.data.turn = 1;
        this.data.winner = null;
        this.save().next();
    }

    setPlayerTurn(player) {
        if(isNan(player) || player < 1 || player > this.game.TotalPlayers) {
            throw new Error('invalid player number');
        }

        this.data.state = STATE.PLAYER_TURN;
        this.data.turn = player;
        this.save().next();
    }

    getPlayerTurn() {
        return this.data.turn;
    }

}

export default GameState;
export { STATE };
