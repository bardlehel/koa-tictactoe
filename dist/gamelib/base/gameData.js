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

    save() {
        let thisGameData = this;
        console.log('saving gamedata...');

        (0, _co2.default)(function* () {
            yield thisGameData.persister.saveGameData(thisGameData[_key], thisGameData.data);
        }).then(function (value) {
            console.log(value);
        }, function (err) {
            console.error(err.stack);
        });
    }

    *load() {
        let thisGameData = this;

        (0, _co2.default)(function* () {
            thisGameData.data = yield thisGameData.persister.loadGameData(thisGameData[_key]);
        }).then(function (value) {
            console.log(value);
        }, function (err) {
            console.error(err.stack);
        });
    }
};

exports.default = GameData;