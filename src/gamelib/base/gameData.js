"use strict";

import co from 'co';

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

export default GameData;