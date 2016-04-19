'use strict';
var fs = require('fs');
var toMD = require('json2md');
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
console.log(targetCards);
/*
  h1: projectName
  h3: targetListName
      ul:
        cardName
        cardDesc
*/
var TrelloCard = (function () {
    function TrelloCard(name, desc) {
        this.name = name;
        this.desc = desc;
    }
    TrelloCard.prototype.toJSON = function () {
        return ''; // Do stuff here
    };
    return TrelloCard;
}());
var TrelloList = (function () {
    function TrelloList(name) {
        this.name = name;
    }
    TrelloList.prototype.addCard = function (card) {
        this.cards.push(card.toJSON());
    };
    TrelloList.prototype.toJSON = function () {
        // Do stuff here
    };
    return TrelloList;
}());
function contains(collection, item) {
    return collection.indexOf(item) > -1;
}
