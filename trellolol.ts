'use strict';

declare var require: any

const fs = require('fs');
const trelloBoard = require('./example.json');
const cards = trelloBoard.cards;
console.log(cards);
