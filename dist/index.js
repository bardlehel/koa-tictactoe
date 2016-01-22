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

var _tictactoeGame = require('./gamelib/tictactoeGame');

var _tictactoeGame2 = _interopRequireDefault(_tictactoeGame);

var _persistence = require('./gamelib/base/persistence');

var _persistence2 = _interopRequireDefault(_persistence);

var _config = require('./config/config');

var _config2 = _interopRequireDefault(_config);

var _register = require('babel-core/register');

var _register2 = _interopRequireDefault(_register);

var _babelPolyfill = require('babel-polyfill');

var _babelPolyfill2 = _interopRequireDefault(_babelPolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let app = (0, _koa2.default)();
let router = (0, _koaRouter2.default)();

app.use((0, _koaRequestXhr2.default)());

app.use((0, _koaStaticFolder2.default)('./src/public'));

app.use(_koaHbs2.default.middleware({
    viewPath: __dirname + '/views'
}));

router.get('/', function* (next) {
    let persistence = new _persistence2.default(_config2.default.mongodb);
    let game = _tictactoeGame2.default.instance();

    yield this.render('startgame', { launcherURL: '' });
});

router.get('/ajax', function* (next) {
    if (this.request.xhr) {
        this.body = { message: 'Hello World' };
    }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(_config2.default.port);