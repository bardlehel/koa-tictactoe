"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let _key = Symbol();

class GameData {
    constructor(persistence, dataKey) {
        this.data = {};
        this[_key] = dataKey;
        this.persister = persistence;
    }

    *save() {
        yield this.persister.saveGameData(this[_key], this.data);
    }

    *load() {
        console.log('loading data for:' + this[_key]);
        this.data = yield this.persister.loadGameData(this[_key]);
    }
};

exports.default = GameData;