"use strict";

//static properties

Object.defineProperty(exports, "__esModule", {
    value: true
});
let playerCount = 0;

//private properties
let _playerCount = Symbol();

class Player {
    constructor() {
        this[_playerCount] = this.getNextPlayerCount();
    }

    get playerCount() {
        return this[_playerCount];
    }

    get hasStartedPlaying() {
        return this.ipAddress != undefined;
    }

    static getNextPlayerCount() {
        return ++playerCount;
    }
};

exports.default = Player;