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

class Persistence {

    constructor(mongoURI, schema) {
        this[_mongoDocumentID] = null;
        this[_mongoSchema] = schema;
        this.connect(mongoURI);
    }

    *connect(mongoConnURI) {
        this[_mongooseConn] = yield _mongoose2.default.connect(mongoConnURI);
        this[_gameDataDocument] = yield this.getNewGameDocument();
        this[_mongoDocumentID] = this[_gameDataDocument].id;
    }

    *getNewGameDocument() {
        return yield this[_mongoSchema].create({ started: new Date() });
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

};

exports.default = Persistence;