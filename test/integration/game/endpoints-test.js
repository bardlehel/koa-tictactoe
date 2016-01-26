"use strict";

var expect = require('chai').expect;
var app = require('../../../src/index');
var co = require('co-supertest');
var request = co.agent(app.listen());
import TicTacToeGame from '../../../src/gamelib/tictactoeGame';
import Persistence from '../../../src/gamelib/base/persistence';

let game = app.game;

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
    it('should return HTTP Status 200', function* (){
        let res = yield request
            .post('/')
            .send()
            .expect(200)
            .end();
    });
});