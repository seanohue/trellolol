#!/usr/bin/env node
'use strict';
/// <reference path="lib/trelloItems.ts"/>
var Trello = require('./lib/trelloItems');
var fs = require('fs');
var commander = require('commander');
var dir = process.cwd() + '/';
// Defaults
var inputFile;
var outputFile;
var targetListName;
// CLI options
commander
    .arguments('<input> <output> [listname]')
    .action(function (input, output, listname) {
    [input, output].forEach(validate);
    inputFile = (input.endsWith('.json') ? input : input + '.json');
    outputFile = (output.endsWith('.md') ? output : output + '.md');
    targetListName = listname || 'Done';
})
    .parse(process.argv);
function validate(arg) {
    if (!arg)
        throw 'You must supply an input and output filename.';
}
/// Set up us the Trello objects.
var trelloBoard = require(dir + inputFile);
var cards = trelloBoard.cards;
var lists = trelloBoard.lists;
//TODO: Pull from board name.
var projectName = trelloBoard.name || 'Project';
// Organize the Trello objects.
var targetListNames = [targetListName];
var targetLists = lists.filter(function (list) { return targetListNames.some(function (name) { return name === list.name; }); });
var targetListIDs = targetLists.map(function (list) { return list.id; });
var targetCards = cards.filter(function (card) { return targetListIDs.some(function (id) { return id === card.idList; }); });
// Put objects into classes...
var myCards = targetCards.map(function (card) { return new Trello.Card(card.name, card.desc); });
var myLists = targetLists.map(function (list) { return new Trello.List(list.name, myCards); });
var myDocument = new Trello.Document(projectName, myLists);
console.log("\nRendered unto Markdown thusly:\n");
console.log(myDocument.toMarkdown());
fs.writeFileSync(dir + outputFile, myDocument.toMarkdown());
