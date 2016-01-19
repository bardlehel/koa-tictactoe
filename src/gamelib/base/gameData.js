"use strict";

import Persistence from 'persistance';

class GameData {
    constructor(persistence) {
        this.data = {};
        this.persister = persistence;
    }

    *save() {
        return yield this.persister.saveGameData('data', this.data);
    }
};

export default GameData();