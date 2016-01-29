"use strict";

import co from 'co';

let _key = Symbol();

class GameData {
    constructor(persistence, dataKey) {
        this.data = {};
        this[_key] = dataKey;
        this.persister = persistence;
    }

    save() {
        let _this = this;
        console.log('saving gamedata...');

        co(function* () {
            yield _this.persister.saveGameData(_this[_key], _this.data);
        }).then(function (value) {},
            function (err) {
                console.error(err.stack);
                throw new Error('persistence::saveGameData failed');
            });

    }

    *load() {
        let _this = this;

        co(function* () {
            _this.data = yield _this.persister.loadGameData(_this[_key]);
        }).then(function (value) {},
            function (err) {
                console.error(err.stack);
                throw new Error('persistence::loadGameData failed');
            });
    }
};

export default GameData;