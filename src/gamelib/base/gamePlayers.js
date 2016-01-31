import _ from 'underscore';
import Player from './player';
import GameData from './gameData';

//private property keys
let _totalPlayers = Symbol();
let _players = Symbol();

const PLAYERS_KEY = 'players';

class GamePlayers extends GameData {
    constructor(numPlayers, persistence) {
        super(persistence, PLAYERS_KEY);

        if(isNaN(numPlayers))
            throw new Error('numPlayers is NaN');
        if(numPlayers <= 0)
            throw new Error('numPlayers is not a valid value');

        this[_totalPlayers] = numPlayers;
        this[_players] = [];

        //create objects for each player in game
        for(var i = 0; i != numPlayers; i++) {
            this[_players].push(new Player());
        }
    }

    get count() {
        return this[_totalPlayers];
    }

    getPlayerByIndex(n) {
        if(n < 0 || n >= this[_totalPlayers])
            throw new Error('bad player index');

        return this[_players][n];
    }

    get numJoined() {
        let count = 0;
        _.each(this[_players], function(p) { if(p.ipAddress) count++; });

        return count;
    }

    hasJoined(ipAddress) {
        return _.find(this[_players], (p)=> p.ipAddress === ipAddress);
    }

    //overloaded GameData methods

    *load() {
        yield super.load();

        //make sure the db data is sorted by index
        this.data = _.sortBy(this.data, 'index' );

        for(let i = 0; i < this.data.length; i++) {
            this[_players][i] = new Player(this.data[i]);
        }
    }

    *save() {
        this.data = [];

        let _this = this;
        this[_players].forEach(function(el) {
            _this.data.push(el.data);
        });

        yield super.save();
    }
}

export default GamePlayers;
export {PLAYERS_KEY};
