"use strict";


import mongoose from 'mongoose';
import {Schema, Document} from 'mongoose';

var TicTacToeDataSchema = new Schema({
    state: String,
    player: Number,
    winner: Number,
    started: Date
});

export default mongoose.model('TicTacToeData',TicTacToeDataSchema);