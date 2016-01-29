"use strict";

import GameData from 'gameData';

//static properties
let playerCount = 0;

//private properties
let _playerCount = Symbol();


class Player {
    constructor(playerData=null) {
        if(!playerData) {
            this[_playerCount] = Player.getNextPlayerCount();
        } else {
            this[_playerCount] = playerData.count;
            this.ipAddress = playerData.ip;
        }
    }

    get playerCount() {
        return this[_playerCount];
    }

    get data() {
        return {
            count: this.playerCount,
            ip: this.ipAddress
        }
    }

    static getNextPlayerCount() {
        return ++playerCount;
    }
};

export default Player;
