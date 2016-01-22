"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class GameData {
    constructor(persistence) {
        this.data = {};
        this.persister = persistence;
    }

    *save() {
        return yield this.persister.saveGameData('data', this.data);
    }
};

exports.default = GameData;