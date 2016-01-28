"use strict";

let _key = Symbol();

class GameData {
    constructor(persistence, dataKey) {
        this.data = {};
        this[_key] = dataKey;
        this.persister = persistence;
    }

    *save() {
        return yield this.persister.saveGameData(this[_key], this.data);
    }

    *load() {
        this.data = yield this.persister.loadGameData(this[_key]);
    }
};

export default GameData;