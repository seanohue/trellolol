'use strict';
var fs = require('fs');
var json2md = require('json2md');
var TrelloCard = (function () {
    function TrelloCard(name, desc) {
        this.name = name;
        this.desc = desc;
    }
    TrelloCard.prototype.toMarkdown = function () {
        return '\n- ' + this.name;
    };
    return TrelloCard;
}());
var TrelloList = (function () {
    function TrelloList(name, cards) {
        this.name = name;
        this.cards = cards;
    }
    TrelloList.prototype.stringifyCards = function () {
        return this.cards.map(function (card) { return card.toMarkdown(); });
    };
    TrelloList.prototype.toJSON = function () {
        return {
            h3: this.name
        };
    };
    TrelloList.prototype.toMarkdown = function () {
        return json2md(this.toJSON()) + this.stringifyCards();
    };
    return TrelloList;
}());
var TrelloDocument = (function () {
    function TrelloDocument(title, lists) {
        this.title = title;
        this.lists = lists;
    }
    TrelloDocument.prototype.toJSON = function () {
        return {
            h1: this.title
        };
    };
    TrelloDocument.prototype.toMarkdown = function () {
        var header = json2md(this.toJSON());
        var compiledLists = this.lists.map(function (list) { return '\n' + list.toMarkdown(); });
        return header.concat(compiledLists);
    };
    return TrelloDocument;
}());
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
var myCards = targetCards.map(function (card) { return new TrelloCard(card.name, card.desc); });
var myLists = targetLists.map(function (list) { return new TrelloList(list.name, myCards); });
var myDocument = new TrelloDocument(projectName, myLists);
console.log(myDocument.toMarkdown());
function contains(collection, item) {
    return collection.indexOf(item) > -1;
}
