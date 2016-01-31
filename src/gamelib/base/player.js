"use strict";

import GameData from './gameData';

//static properties
let nextPlayerIndex = 0;

//private properties
let _playerIndex = Symbol();


class Player {
    constructor(playerData=null) {
        if(!playerData) {
                this[_playerIndex] = Player.getNextPlayerIndex();
        } else {
            this[_playerIndex] = playerData.index;
            this.ipAddress = playerData.ip;
        }
    }

    get playerIndex() {
        return this[_playerIndex];
    }

    get data() {
        return {
            count: this.playerIndex,
            ip: this.ipAddress
        }
    }

    static getNextPlayerIndex() {
        let ret = nextPlayerIndex;
        ++nextPlayerIndex;
        return ret;
    }
};

export default Player;
