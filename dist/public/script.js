"use strict";

var _jQuery = require("jQuery");

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ajaxUrl = ""; //defined in handlebars template

let canClick = true;
let xImagePath = "";
let oImagePath = "";
let context;
let timer = null;

const PlayerX = 0;
const PlayerO = 1;

function updateBoard(data) {

    let gameState = '';
    let winner = '';
    let message = '';

    for (let key in data) {

        var val = data[key];

        if (key.substr(0, 3) == "box") {
            (0, _jQuery2.default)("#" + key).empty();

            if (val == 0) {
                (0, _jQuery2.default)("#" + key).prepend('<img src="' + xImagePath + '" />');
                (0, _jQuery2.default)("#" + key).data('state', 'x');
            } else if (val == 'O') {
                (0, _jQuery2.default)("#" + key).prepend('<img src="' + oImagePath + '" />');
                (0, _jQuery2.default)("#" + key).data('state', 'o');
            }
        } else (0, _jQuery2.default)("#" + key).data('state', null);

        if (key === 'game_state') gameState = val;
        if (key === 'winner') winner = val;
        if (key === 'message') message = val;
    }

    if (gameState == 'OVER') {
        if (winner == 0) winner = 'X wins!';else if (winner == 1) winner = 'O wins!';else winner = 'The game is a draw!';

        (0, _jQuery2.default)("#message").html(winner);
    } else (0, _jQuery2.default)("#message").html(message);
}

(0, _jQuery2.default)(document).ready(function () {

    updateBoard(context);

    timer = setTimeout(function () {
        _jQuery2.default.getJSON(ajaxUrl, function (data) {
            updateBoard(data);
        });
    }, 3000);

    (0, _jQuery2.default)("#board div").click(function () {
        //don't allow filled box to be clicked on...
        if (this.data('state')) return;

        //get the id of this clicked box and send it to the server
        let squareNum = (0, _jQuery2.default)(this).attr('id').substring(3, 4);
        let newUrl = ajaxUrl.replace('ajax', '');
        _jQuery2.default.post(newUrl, { square: squareNum }, function (data) {
            updateBoard(data);
        });
    });
});