"use strict";

import {expect} from 'chai';
import app from '../../../src/index';
import co from 'co-supertest';
var request = co.agent(app.listen());
import TicTacToeGame from '../../../src/gamelib/tictactoeGame';
import Persistence from '../../../src/gamelib/base/persistence';

before(function(done) {
    app.gameStartCallback = function() {
        done();
        console.log('game started.');
    };
});

describe('GET /', function() {
        it('should return HTTP Status 200', function* (){
            var res = yield request
                .get('/')
                .expect(200)
                .end();
        })
});

describe('GET /ajax', function() {
    it('should return HTTP Status 200', function* (){
        let res = yield request
            .get('/ajax')
            .expect(200)
            .end();
    })
});

describe('POST /', function() {
    it('should return HTTP Status 404 for posting empty JSON', function* (){

        let data = {};

        let res = yield request
            .post('/')
            .set('Content-Type',  'application/json')
            .send(data)
            .expect(404)
            .end();
    });
});

after(function(done) {
    app.server.close();
    done();
});