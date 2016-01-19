/**
 * Created by lehel on 1/18/16.
 */
import Game from 'game';

let _joinedPlayers = Symbol();

class TicTacToeGame extends Game {
    const TOTAL_PLAYERS = 2;

    get instance() {
        return super.instance;
    }

    startGame() {
        this[_joinedPlayers] = 0;
        super.startNewGame(this.TOTAL_PLAYERS);
    }

    playerJoin(ipAddr) {

        if(this[_joinedPlayers] < 3)
            this[_joinedPlayers]++;
        else return;

        var player = super.getPlayer(this[_joinedPlayers]);
        player.ipAddress = ipAddr;
    }
}

export default TicTacToeGame;