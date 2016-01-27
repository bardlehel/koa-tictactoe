"use strict";

var _koaStaticFolder = require('koa-static-folder');

var _koaStaticFolder2 = _interopRequireDefault(_koaStaticFolder);

var _koaRequestXhr = require('koa-request-xhr');

var _koaRequestXhr2 = _interopRequireDefault(_koaRequestXhr);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaHandlebars = require('koa-handlebars');

var _koaHandlebars2 = _interopRequireDefault(_koaHandlebars);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _coBody = require('co-body');

var _coBody2 = _interopRequireDefault(_coBody);

var _tictactoeGame = require('./gamelib/tictactoeGame');

var _tictactoeGame2 = _interopRequireDefault(_tictactoeGame);

var _persistence = require('./gamelib/base/persistence');

var _persistence2 = _interopRequireDefault(_persistence);

var _TicTacToeGameState = require('./models/TicTacToeGameState');

var _TicTacToeGameState2 = _interopRequireDefault(_TicTacToeGameState);

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

require('babel-core/register');

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let app = module.exports = (0, _koa2.default)();
let router = (0, _koaRouter2.default)();
let persistence = new _persistence2.default(_config2.default.mongodb, _TicTacToeGameState2.default);
let game = new _tictactoeGame2.default(persistence);
app.game = game;

function handleError(err) {
    console.log('server error', err);
    process.exit(1);
}

app.on('error', handleError);

app.use((0, _koaRequestXhr2.default)());
app.use((0, _koaStaticFolder2.default)('./public'));
router.use((0, _koaHandlebars2.default)({
    viewsDir: '/src/views',
    layoutsDir: '/src/layouts',
    defaultLayout: 'main'
}));

function getClientGameRole(clientIP) {
    let client = _tictactoeGame2.default.SPECTATOR;

    if (game.getIPAddressForPlayer(_tictactoeGame2.default.PLAYER_ONE) == clientIP) {
        client = _tictactoeGame2.default.PLAYER_ONE;
    } else if (game.getIPAddressForPlayer(_tictactoeGame2.default.PLAYER_TWO) == clientIP) {
        client = _tictactoeGame2.default.PLAYER_TWO;
    }

    return client;
}

function getDataForClient(clientIP) {
    return {
        gameData: game.getGameData(),
        client: getClientGameRole(clientIP)
    };
}

router.get('/', function* () {

    console.log('handling GET /');

    //Determnextsine if ip is new and who it belongs to (player1, player2 or spectator)
    if (!game.getIPAddressForPlayer(_tictactoeGame2.default.PLAYER_ONE) || !game.getIPAddressForPlayer(_tictactoeGame2.default.PLAYER_TWO)) {

        game.registerPlayer(this.ip);

        //step through game logic
        game.doGameLogicStep();
    }

    let data = getDataForClient(this.ip);
    this.status = 200;
    yield this.render("index", {
        data: data,
        ajaxEndpoint: this.request.origin + '/ajax'
    });
});

router.post('/', function* () {
    console.log('handling POST /');
    let role = getClientGameRole(this.ip);
    let data = yield (0, _coBody2.default)(this);

    if (role == _tictactoeGame2.default.SPECTATOR) return;
    let squareNum = parseInt(data.square);

    game.board.setSquare(squareNum, role);
    game.doGameLogicStep();

    this.status = 200;
    this.redirect('/');
});

router.get('/ajax', function* () {
    console.log('handling GET /ajax/');

    this.status = 200;
    yield this.body = {
        data: getDataForClient(this.ip),
        ajaxEndpoint: this.request.origin + '/ajax'
    };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(_config2.default.port, 'localhost', function (err) {
    if (err) handleError(err);

    console.log('listening on Port:' + _config2.default.port);
});