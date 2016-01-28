var app = require('../../../src/index');
var co = require('co-supertest');
var request = co.agent(app.listen());
import TicTacToeGame from '../../../src/gamelib/tictactoeGame';
import Persistence from '../../../src/gamelib/base/persistence';
import config from './config/config';

let game = new TicTacToeGame(new Persistence(config.mongodb));

describe('GET /', function() {
    it('should return HTTP Status 200', function* (){
        var res = yield request
            .get('/')
            .expect(200)
            .end();
    })
});
