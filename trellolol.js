'use strict';
var fs = require('fs');
var trelloBoard = require('./example.json');
var cards = trelloBoard.cards;
var lists = trelloBoard.lists;
var targetListNames = ['Technical'];
var targetLists = lists.filter(function (list) { return contains(targetListNames, list.name); });
var targetListIDs = targetLists.map(function (list) { return list.id; });
var targetCards = cards.filter(function (card) { return contains(targetListIDs, card.idList); });
console.log(targetCards);
function contains(collection, item) {
    return collection.indexOf(item) > -1;
}
