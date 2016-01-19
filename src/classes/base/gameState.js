/**
 * Created by lehel on 1/18/16.
 */
import Enum from "enum";
Enum.register();

class GameState {
    const STATE = new Enum('NOT_STARTED', 'WAITING_ON_PLAYER', 'PLAYER_TURN', 'GAME_OVER');

    constructor(gameInstance) {
        this.game = gameInstance;
        reset();
    }

    reset() {
        this.state = this.STATE.NOT_STARTED;
        this.turn = 1;
        this.winner = null;
    }

    setStatePlayerTurn(player) {
        if(isNan(player) || player < 1 || player > this.game.PlayerCount) {
            throw new Error('invalid player number');
        }

        this.state = this.STATE.PLAYER_TURN;
        this.turn = player;
    }

    setStateGameOver(winnerNumber) {
        this.state = this.STATE.GAME_OVER;
        this.turn = null;
        this.winner = winnerNumber;
    }


}

export default GameState;