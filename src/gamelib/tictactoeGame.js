/**
 * Created by lehel on 1/18/16.
 */
import Game from 'base/game';
import PersistentGameState from 'persistentGameState';
import CheckerBoard from 'checkerBoard';
import STATE from 'checkerBoard';

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

    setState(state, player, winner) {
        super.setState(state, player, winner);
        this.gameState.saveGame();
    }

    doGameLogic() {
        switch(this.gameState.state) {
            case STATE.NOT_STARTED:
                break;
            case STATE.WAITING_ON_PLAYER:
                break;
            case STATE.PLAYER_TURN:
                break;
            case STATE.GAME_OVER:
                break;
            default:
                throw new Error('code should not be reached');
                break;
        };
    }
}

export default TicTacToeGame;