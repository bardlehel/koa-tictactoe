"use strict";


import mongoose from "mongoose";
import Schema from "mongoose.Schema";
import Document from 'mongoose.Document';

var TicTacToeDataSchema = new Schema({
    state: String,
    player: Number,
    winner: Number,
    started: Date
});

export default mongoose.model('TicTacToeData',TicTacToeDataSchema);