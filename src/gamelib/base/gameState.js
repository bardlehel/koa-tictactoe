/**
 * Created by lehel on 1/18/16.
 */
'use strict';

import Enum from "enum";
import GameData from 'gameData';

Enum.register();

var expSTATE;

class GameState extends GameData {
    const STATE =
        new Enum(
            'NOT_STARTED',
            'WAITING_ON_PLAYER',
            'PLAYER_TURN',
            'PLAYER_FINISHED_TURN',
            'GAME_OVER');

    expSTATE = STATE;

    constructor(gameInstance, persistence) {
        super(persistence);
        this.game = gameInstance;
        reset();
    }

    reset() {
        this.data.state = this.STATE.NOT_STARTED;
        this.data.turn = 1;
        this.data.winner = null;
        this.save();
    }

    setPlayerTurn(player) {
        if(isNan(player) || player < 1 || player > this.game.PlayerCount) {
            throw new Error('invalid player number');
        }

        this.state = this.STATE.PLAYER_TURN;
        this.turn = player;
        this.save();
    }

    getPlayerTurn() {
        return this.turn;
    }

    setStateGameOver(winnerNumber) {
        this.state = this.STATE.GAME_OVER;
        this.turn = null;
        this.winner = winnerNumber;
        this.save();
    }


}

export default GameState;
export { expSTATE as STATE };
