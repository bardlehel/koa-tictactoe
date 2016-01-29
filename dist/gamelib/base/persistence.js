"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        let gen = this.connect(mongoURI);
        if (gen.next().value) console.log('connected to ' + mongoURI);else throw new Error('could not connect to' + mongoURI);
    }

    *connect(mongoConnURI) {
        this[_mongooseConn] = yield _mongoose2.default.connect(mongoConnURI);
        if (this[_mongooseConn]) return true;

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

    *loadGameData(key) {

        return this[_gameDataDocument][key];
    }

    *loadLastGameDocument() {
        console.log('bbb');
        this[_gameDataDocument] = null;
        this[_gameDataDocument] = yield this[_mongoSchema].findOne().sort({ created_at: -1 }).exec();

        if (!this[_gameDataDocument]) throw new Error('could not find record in database');

        this[_mongoDocumentID] = this[_gameDataDocument].id;
    }

};

exports.default = Persistence;