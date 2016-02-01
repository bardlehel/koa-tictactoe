"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MOCK_CONNECTION = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//private property keys:
let _mongooseConn = Symbol();
let _mongoModel = Symbol();
let _mongoDocumentID = Symbol();
let _mock = Symbol();

let _connectedCallback = null;

const MOCK_CONNECTION = 'mock';

var connection = _mongoose2.default.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function () {
    console.log('Successfully connected to mongodb');
    if (_connectedCallback) _connectedCallback();
});

class Persistence {

    constructor(mongoURI, model, connectCallback) {
        let _this = this;

        _connectedCallback = function _connectedCallback() {
            console.log('calling connect callbacks...');
            connectCallback();
            _this.connectCallback();
        };

        if (mongoURI === MOCK_CONNECTION) {
            if (connectCallback) connectCallback();

            this.isMock = true;

            return;
        }

        this[_mongoModel] = model;

        let options = {
            server: { poolSize: 5 },
            replset: { rs_name: 'gamerepl' }
        };

        options.server.socketOptions = options.replset.socketOptions = { keepAlive: 120 };
        let gen = this.connect(mongoURI, options);

        if (gen.next().value) console.log('connecting to ' + mongoURI);else throw new Error('could not connect to' + mongoURI);
    }

    *connect(mongoConnURI) {
        this[_mongooseConn] = yield _mongoose2.default.connect(mongoConnURI);
        if (this[_mongooseConn]) return true;

        return false;
    }

    *createNewGameDocument() {
        let match = yield this[_mongoModel].create({ started: new Date() });
        this[_mongoDocumentID] = match.id;
    }

    *saveGameData(key, val) {
        if (this.isMock) return;

        console.log('saving game data: key=' + key + ' value=' + val);
        let gameData = yield this[_mongoModel].findOne({ _id: this[_mongoDocumentID] }).exec();
        gameData[key] = val;
        console.log(gameData);

        yield gameData.save(function (err) {
            if (err) console.log(err);else 'successfully saved game!';
        });
    }

    *loadGameData(key) {
        console.log('looking up document for id:' + this[_mongoDocumentID]);
        let gameData = yield this[_mongoModel].findOne({ _id: this[_mongoDocumentID] }).exec();
        console.log('returning data for key:' + key);
        console.log('gameData: ');
        console.log(gameData);
        return gameData[key];
    }

    *loadLastGameDocument() {
        let gameData = yield this[_mongoModel].findOne().sort('-started').exec();

        if (!gameData) throw new Error('could not find record in database');else {
            console.log('loaded data:');
            console.log(gameData);
        }

        this[_mongoDocumentID] = gameData.id;
    }

};

exports.default = Persistence;
exports.MOCK_CONNECTION = MOCK_CONNECTION;