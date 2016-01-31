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

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

var _tictactoeController = require('./controllers/tictactoeController');

var _tictactoeController2 = _interopRequireDefault(_tictactoeController);

require('babel-core/register');

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let app = module.exports = (0, _koa2.default)();
let router = (0, _koaRouter2.default)();

app.startGame = _tictactoeController.startGame;

function handleError(err) {
    console.log('server error', err);
    console.log(err.stack);
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

router.get('/', function* () {
    yield _tictactoeController2.default.getGame(this);
});

router.post('/', function* () {
    yield _tictactoeController2.default.postMove(this);
});

router.get('/ajax', function* () {
    yield _tictactoeController2.default.getCurrentGameState(this);
});

app.use(router.routes()).use(router.allowedMethods());

function gameStartCallback() {
    console.log('game started.');

    app.server = app.listen(_config2.default.port, '0.0.0.0', function (err) {
        if (err) handleError(err);

        if (app.gameStartCallback) app.gameStartCallback();

        console.log('listening on Port:' + _config2.default.port);
    });
}

app.startGame(gameStartCallback);