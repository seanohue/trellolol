'use strict';
var Trello = require('./lib/trelloItems');
var fs = require('fs');
var json2md = require('json2md');
/// Set up us the Trello objects.
var trelloBoard = require('./example.json');
var cards = trelloBoard.cards;
var lists = trelloBoard.lists;
//TODO: Pull from board name.
var projectName = 'Schmup';
// Organize the Trello objects.
var targetListNames = ['Technical'];
var targetLists = lists.filter(function (list) { return contains(targetListNames, list.name); });
var targetListIDs = targetLists.map(function (list) { return list.id; });
var targetCards = cards.filter(function (card) { return contains(targetListIDs, card.idList); });
// Put objects into classes...
var myCards = targetCards.map(function (card) { return new Trello.Card(card.name, card.desc); });
var myLists = targetLists.map(function (list) { return new Trello.List(list.name, myCards); });
var myDocument = new Trello.Document(projectName, myLists);
console.log(myDocument.toMarkdown());
function contains(collection, item) {
    return collection.indexOf(item) > -1;
}
