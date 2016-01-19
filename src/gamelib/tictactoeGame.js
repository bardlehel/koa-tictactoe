/**
 * Created by lehel on 1/18/16.
 */
import Game from 'base/game';
import PersistentGameState from 'persistentGameState';
import CheckerBoard from 'checkerBoard';
import STATE from 'checkerBoard';


class TicTacToeGame extends Game {
    const TOTAL_PLAYERS = 2;
    const BOARD_SIZE = 3;
    const PLAYER_ONE = 0;
    const PLAYER_TWO = PLAYER_ONE + 1;

    get instance() {
        return super.instance;
    }

    getIPAddressForPlayer(num) {
        if(isNaN(num) || num < 1) throw new Error('bad player number');
        return getPlayer(num).ipAddress;
    }



    setupGame(connURI) {
        this.joinedPlayers = new Map();
        this.gameState = new PersistentGameState(this, connURI);
        this.board = new CheckerBoard(this.BOARD_SIZE);
        this.filledSquares = 0;
        super.startNewGame(this.TOTAL_PLAYERS);
    }

    playerJoin(ipAddr) {
        if (this.joinedPlayers.has(ipAddr)) return;
        let joinedSize = this.joinedPlayers.size;
        var player = super.getPlayer(joinedSize);
        player.ipAddress = ipAddr;
        this.joinedPlayers.set(ipAddr, player);
    }

    setState(state, player=null, winner=null) {
        super.setState(state, player, winner);
        this.gameState.saveGame();
    }

    isGameOver() {

    }

    getWinner() {

    }

    doGameLogic() {
        switch(this.gameState.state) {
            case STATE.NOT_STARTED:
                if(this.joinedPlayers.size > 0) {
                    this.setState(STATE.WAITING_ON_PLAYER);
                }
                break;
            case STATE.WAITING_ON_PLAYER:
                if(this.joinedPlayers.size === 2) {
                    this.setState(STATE.PLAYER_TURN, PLAYER_ONE);
                }
                break;
            case STATE.PLAYER_TURN:
                let playerOneTurnCount = this.board.getFilledSquares('X');
                let playerTwoTurnCount = this.board.getFilledSquares('O');
                if (this.gameState.getPlayerTurn() == PLAYER_ONE
                    && playerOneTurnCount > playerTwoTurnCount) {
                    this.setState(STATE.PLAYER_FINISHED_TURN, PLAYER_ONE);
                }
                break;
            case STATE.PLAYER_FINISHED_TURN:
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