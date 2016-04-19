'use strict';
var fs = require('fs');
/// Set up us the Trello objects.
var trelloBoard = require('./example.json');
var cards = trelloBoard.cards;
var lists = trelloBoard.lists;
var targetListNames = ['Technical'];
var targetLists = lists.filter(function (list) { return targetListNames.indexOf(list.name) > -1; });
console.log(targetLists);
