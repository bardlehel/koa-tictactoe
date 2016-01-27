"use strict";

var ajaxUrl = ""; //defined in handlebars template
let canClick = true;
let xImagePath = "";
let oImagePath = "";
let context;
let timer = null;
let clientRole = null;

const SPECTATOR = -1;
const PLAYER_X = 0;
const PLAYER_O = 1;

function updateGame(gameData) {

    if(!gameData || !gameData.data)
        return;

    let data = gameData.data.gameData;

    if(!data || !data.board || !data.state ) {
        alert('Not getting correct data from server!');
        return;
    }


    clientRole = gameData.data.client;
    let board = data.board;
    let gameState = data.state.state.name;
    let playerTurn = data.state.turn;
    let winner = data.state.turn;
    let message = data.message;
    let roleText = 'You are a spectator';

    if(clientRole === PLAYER_X)
        roleText = 'You are X';
    else if(clientRole = PLAYER_Y)
        roleText = 'Your are O';

    $("#role").html(roleText);
    $("#message").html(message);

    for (let square = 1; i < board.length; square++) {
        if(board[square] === 'X') {
            $("#box" + square).prepend('<img src="' + xImagePath + '" />');
            $("#box" + square).data('state', 'x');
        } else if(board[square] === 'O') {
            $("#box" + square).prepend('<img src="' + oImagePath + '" />');
            $("#box" + square).data('state', 'o');
        } else {
            $("#box" + square).empty();
            $("#box" + square).data('state', null);
        }
    }
}

$(document).ready(function() {
    updateGame(context);

    timer = setInterval(function() {
        $.getJSON(ajaxUrl, function(data) {
            alert(data);
            updateBoard(data);
        });
    }, 3000);

    $("#board div").click(function() {
        //don't allow filled box to be clicked on...
        if ($(this).data('state'))
            return;
        //don't allow spectator to input
        if(clientRole === -1)
            return;

        //get the id of this clicked box and send it to the server
        let squareNum = $(this).attr('id').substring(3,4);
        let newUrl = ajaxUrl.replace('ajax', '');
        $.post( newUrl, { square: squareNum }, function (data, status) {
            alert('after data');
            alert(data);
            updateGame(data);
        }).fail(function(err){alert(err)});
    });
});
