"use strict";
var json2md = require('json2md');
var Card = (function () {
    function Card(name, desc) {
        this.name = name;
        this.desc = desc;
    }
    Card.prototype.toMarkdown = function () {
        return '\n- ' + this.name;
    };
    return Card;
}());
exports.Card = Card;
var List = (function () {
    function List(name, cards) {
        this.name = name;
        this.cards = cards;
    }
    List.prototype.stringifyCards = function () {
        return this.cards.map(function (card) { return card.toMarkdown(); }).join('');
    };
    List.prototype.toJSON = function () {
        return {
            h3: this.name
        };
    };
    List.prototype.toMarkdown = function () {
        return json2md(this.toJSON()) + this.stringifyCards();
    };
    return List;
}());
exports.List = List;
var Document = (function () {
    function Document(title, lists) {
        this.title = title;
        this.lists = lists;
    }
    Document.prototype.toJSON = function () {
        return {
            h1: this.title
        };
    };
    Document.prototype.toMarkdown = function () {
        var header = json2md(this.toJSON());
        var compiledLists = this.lists.map(function (list) { return '\n' + list.toMarkdown(); });
        return header.concat(compiledLists);
    };
    return Document;
}());
exports.Document = Document;
