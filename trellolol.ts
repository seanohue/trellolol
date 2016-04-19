'use strict';

declare var require: any
const fs = require('fs');

/// Set up us the Trello objects.
const trelloBoard = require('./example.json');
const cards: any[] = trelloBoard.cards;
const lists: any[] = trelloBoard.lists;
const targetListNames: string[] = ['Technical'];
const targetLists: any[] = lists.filter(list => targetListNames.indexOf(list.name) > -1);

console.log(targetLists);
