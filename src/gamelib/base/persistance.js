/**
 * Created by lehel on 1/19/16.
 */
import mongoose from 'mongoose';

//private member properties
let _mongooseConn = Symbol();
let _mongoSchema = Symbol();
let _mongoDocumentID = Symbol();
let _gameDataDocument = Symbol();

class Persistence {
    const DEFAULT_COLLECTION_NAME = 'game';

    constructor(mongoURI, schema) {
        this[_mongoDocumentID] = null;
        this[_mongoSchema] = schema;
        connect(mongoURI);
    }

    *connect(mongoConnURI) {
        this[_mongooseConn] = yield mongoose.connect(mongoConnURI);
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

export default Persistence;
