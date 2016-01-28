"use strict";

import mongoose from 'mongoose';

//private member properties
let _mongooseConn = Symbol();
let _mongoSchema = Symbol();
let _mongoDocumentID = Symbol();
let _gameDataDocument = Symbol();
let _shouldLoad = Symbol();

class Persistence {

    constructor(mongoURI, schema) {
        this[_mongoDocumentID] = null;
        this[_mongoSchema] = schema;
        this.connect(mongoURI);
        console.log('connected to ' + mongoURI);
    }

    *connect(mongoConnURI) {
        this[_mongooseConn] = yield mongoose.connect(mongoConnURI);
    }

    *createNewGameDocument() {
        this[_gameDataDocument] = yield this[_mongoSchema].create({ started: new Date() });
        this[_mongoDocumentID] = this[_gameDataDocument].id;
    }

    *saveGameData(key, val) {
        let gameData = this[_gameDataDocument];
        gameData[key] = val;

        try {
            yield gameData.save();
        } catch (err) {
            err.message = 'game data could not be saved';
            throw err;
        }
    }

    *loadGameData(key) {
        return this[_gameDataDocument][key];
    }

    clearGameDocument() {
        this[_gameDataDocument] = null;
    }

    *loadLastGameDocument() {
        this[_gameDataDocument] = null;
        this[_gameDataDocument] = yield this[_mongoSchema].findOne().sort({created_at: -1}).exec();

        if(!this[_gameDataDocument])
            throw new Error('could not find record in database');

        this[_mongoDocumentID] = this[_gameDataDocument].id;
    }






};

export default Persistence;
