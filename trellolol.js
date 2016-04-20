'use strict';
var Trello = require('./lib/trelloItems');
var fs = require('fs');
var commander = require('commander');
// Defaults
var inputFile = './example.json';
var outputFile = './example.md';
var targetListName = 'Adding game features';
// CLI options
commander
    .arguments('<input file>', '<output file>', '<list name>')
    .action(function (input, output, name) {
    inputFile = input.endsWith('.json') ? input : input + '.json';
    outputFile = output.endsWith('.md') ? output : output + '.md';
    targetListName = name || targetListName;
})
    .parse(process.argv);
/// Set up us the Trello objects.
var trelloBoard = require(inputFile);
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
fs.writeFileSync(outputFile, myDocument.toMarkdown());
