"use strict";

var _koaStaticFolder = require('koa-static-folder');

var _koaStaticFolder2 = _interopRequireDefault(_koaStaticFolder);

var _koaRequestXhr = require('koa-request-xhr');

var _koaRequestXhr2 = _interopRequireDefault(_koaRequestXhr);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaHbs = require('koa-hbs');

var _koaHbs2 = _interopRequireDefault(_koaHbs);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _coBody = require('co-body');

var _coBody2 = _interopRequireDefault(_coBody);

var _tictactoeGame = require('./gamelib/tictactoeGame');

var _tictactoeGame2 = _interopRequireDefault(_tictactoeGame);

var _persistence = require('./gamelib/base/persistence');

var _persistence2 = _interopRequireDefault(_persistence);

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

require('babel-core/register');

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let app = (0, _koa2.default)();
let router = (0, _koaRouter2.default)();
let persistence = new _persistence2.default(_config2.default.mongodb);
let game = new _tictactoeGame2.default(persistence);

app.use((0, _koaRequestXhr2.default)());
app.use((0, _koaStaticFolder2.default)('./src/public'));
app.use(_koaHbs2.default.middleware({
    viewPath: __dirname + '/views'
}));

router.get('/', function* (next) {

    //Determine if ip is new and who it belongs to (player1, player2 or spectator)
    if (!game.getIPAddressForPlayer(_tictactoeGame2.default.PLAYER_ONE) || !game.getIPAddressForPlayer(_tictactoeGame2.default.PLAYER_TWO)) {
        game.registerPlayer(this.ip);
        //step through game logic
        game.doGameLogicStep();
    }

    yield this.render('views/startgame', { gameData: game.getGameData() });
});

router.post('/', function* (next) {
    let player = null;

    if (game.getIPAddressForPlayer(_tictactoeGame2.default.PLAYER_ONE) == this.ip) {
        player = _tictactoeGame2.default.PLAYER_ONE;
    } else if (game.getIPAddressForPlayer(_tictactoeGame2.default.PLAYER_TWO) == this.ip) {
        player = _tictactoeGame2.default.PLAYER_TWO;
    } else return;

    let data = (0, _coBody2.default)(this);

    game.board.setSquare(data.square, player);
    game.doGameLogicStep();
});

router.get('/ajax', function* (next) {
    if (this.request.xhr) {
        this.body = { gameData: game.getGameData() };
        this.statusCode = 200;
    }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(_config2.default.port);