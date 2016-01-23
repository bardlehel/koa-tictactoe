"use strict";

import Enum from "enum";
import GameData from './gameData';

Enum.register();

const STATE =
    new Enum(
        'NOT_STARTED',
        'WAITING_ON_PLAYER',
        'PLAYER_TURN',
        'PLAYER_FINISHED_TURN',
        'GAME_OVER');

class GameState extends GameData {

    constructor(gameInstance, persistence) {
        super(persistence);
        this.game = gameInstance;
        this.reset();
    }

    reset() {
        this.data.state = STATE.NOT_STARTED;
        this.data.turn = 1;
        this.data.winner = null;
        this.save();
    }

    setPlayerTurn(player) {
        if(isNan(player) || player < 1 || player > this.game.PlayerCount) {
            throw new Error('invalid player number');
        }

        this.state = STATE.PLAYER_TURN;
        this.turn = player;
        this.save();
    }

    getPlayerTurn() {
        return this.turn;
    }

}

export default GameState;
export { STATE };
