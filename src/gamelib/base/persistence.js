"use strict";

import mongoose from 'mongoose';

//private property keys:
let _mongooseConn = Symbol();
let _mongoSchema = Symbol();
let _mongoDocumentID = Symbol();
let _gameDataDocument = Symbol();

class Persistence {

    constructor(mongoURI, schema) {
        this[_mongoDocumentID] = null;
        this[_mongoSchema] = schema;
        let gen = this.connect(mongoURI);
        if(gen.next().value)
            console.log('connected to ' + mongoURI);
        else throw new Error('could not connect to' + mongoURI);
    }

    *connect(mongoConnURI) {
        this[_mongooseConn] = yield mongoose.connect(mongoConnURI);
        if(this[_mongooseConn])
            return true;

        return false;
    }

    *createNewGameDocument() {
        this[_gameDataDocument] = yield this[_mongoSchema].create({ started: new Date() });
        this[_mongoDocumentID] = this[_gameDataDocument].id;
    }

    *saveGameData(key, val) {
        console.log('saving game data...');
        let gameData = this[_gameDataDocument];
        gameData[key] = val;

        try {
            yield gameData.save();
        } catch (err) {
            err.message = 'game data could not be saved';
            throw err;
        }
    }

    loadGameData(key) {
        if(!this[_gameDataDocument])
            throw new Error('no game document loaded!');

        return this[_gameDataDocument][key];
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
