#!/usr/bin/env node
'use strict';
/// <reference path="lib/trelloItems.ts"/>
var Trello = require('./lib/trelloItems');
var fs = require('fs');
var commander = require('commander');
// Defaults
var inputFile;
var outputFile;
var targetListName;
// CLI options
commander
    .arguments('<input> <output> [listname]')
    .option('-n, --newer', 'Only include cards from the past 30 days')
    .option('-o, --open', 'Only include open cards')
    .option('-c, --closed', 'Only include closed cards')
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
//TODO: Allow for dynamic call to Trello API via an option?
var dir = process.cwd() + '/';
var trelloBoard = require(dir + inputFile);
var cards = trelloBoard.cards;
var lists = trelloBoard.lists;
//TODO: Pull from board name.
var projectName = trelloBoard.name || 'Project';
// Organize the Trello objects.
// TODO: Allow for multiple list names to be targeted.
var targetListNames = [targetListName];
var targetLists = lists
    .filter(function (list) { return targetListNames.some(function (name) { return name === list.name; }); });
var targetListIDs = targetLists
    .map(function (list) { return list.id; });
var targetCards = cards
    .filter(function (card) { return targetListIDs.some(function (id) { return id === card.idList; }); })
    .filter(onlyFromLastMonth)
    .filter(openOrClosed);
// Put objects into classes...
var myCards = targetCards
    .map(function (card) { return new Trello.Card(card.name, card.desc); });
var myLists = targetLists
    .map(function (list) { return new Trello.List(list.name, myCards); });
var myDocument = new Trello.Document(projectName, myLists);
console.log("\nRendered unto Markdown thusly:\n");
console.log(myDocument.toMarkdown());
fs.writeFileSync(dir + outputFile, myDocument.toMarkdown());
function openOrClosed(card) {
    if (commander.open && commander.closed)
        return true;
    if (commander.open)
        return card.closed !== 'true';
    if (commander.closed)
        return card.closed === 'true';
    return true;
}
function onlyFromLastMonth(card) {
    if (!commander.newer)
        return true;
    var base = 10;
    var today = new Date();
    var month = today.getMonth() + 1;
    var day = today.getDay() + 1;
    var cardMonth = parseInt(card.dateLastActivity.substring(5, 7), base);
    var cardDay = parseInt(card.dateLastActivity.substring(8, 10), base);
    var isSameMonth = cardMonth === month;
    var isPreviousMonth = cardMonth === cardMonth - 1;
    var isWithinThirty = isPreviousMonth && cardDay >= day;
    return isSameMonth || isWithinThirty;
}
