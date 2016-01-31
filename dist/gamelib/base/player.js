"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _gameData = require("./gameData");

var _gameData2 = _interopRequireDefault(_gameData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//static properties
let nextPlayerIndex = 0;

//private properties
let _playerIndex = Symbol();

class Player {
    constructor() {
        let playerData = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        if (!playerData) {
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
        };
    }

    static getNextPlayerIndex() {
        let ret = nextPlayerIndex;
        ++nextPlayerIndex;
        return ret;
    }
};

exports.default = Player;