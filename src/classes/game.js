/**
 * Created by: Lehel Kovach
 * Desc: Game class which is a singleton...
 */

import _ from 'underscore';
import PersistentGameState from 'persistentGameState';

//private properties:
let _singleGameObject = Symbol();
let _singletonEnforcer = Symbol();
let _players = [];

class Game {
    constructor(enforcer) {
        if(enforcer != _singletonEnforcer) throw "Cannot construct singleton";
        this.gameState = new PersistentGameState();
    }

    static get instance() {
        if(!this[_singleGameObject]) {
            this[_singleGameObject] = new Game(_singletonEnforcer);
        }
        return this[_singleGameObject];
    }

    startNewGame(numPlayers) {

        if(isNaN(numPlayers))
            throw new Error('numPlayers is NaN');
        if(numPlayers <= 0)
            throw new Error('numPlayers is not a valid value');

        //create objects for each player in game
        for(var i = 0; i != numPlayers; i++) {
            this[_player].push(new Player());
        }
    };

    get PlayerCount() {
        return this[_players].length;
    }

    getPlayer(num) {
        return _.find(this[_players], ()=>this.playerCount == num);
    }
};

export default Game;