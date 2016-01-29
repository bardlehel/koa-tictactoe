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
        console.log('saving gamedata...');
        yield this.persister.saveGameData(this[_key], this.data);
    }

    *load() {
        this.data = yield this.persister.loadGameData(this[_key]);
    }
};

export default GameData;