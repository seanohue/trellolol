'use strict';
/// <reference path="lib/trelloItems.ts"/>
declare var require: any;

import Trello = require('./lib/trelloItems');

const fs = require('fs');
const commander = require('commander');

// Defaults
let inputFile = './example.json';
let outputFile = './example.md';

// CLI options
commander
  .arguments('<input file>', '<output file>')
  .action((input, output) => {
    inputFile = input.endsWith('.json') ? input : input + '.json';
    outputFile = output.endsWith('.md') ? output : output + '.md';
  })
  .parse(process.argv);


/// Set up us the Trello objects.
const trelloBoard = require(inputFile);
const cards: any[] = trelloBoard.cards;
const lists: any[] = trelloBoard.lists;

//TODO: Pull from board name.
const projectName: string = 'Schmup';

// Organize the Trello objects.
const targetListNames: string[] = ['Adding game features'];
const targetLists: any[] = lists.filter(list => targetListNames.some(name => name === list.name));
const targetListIDs: string[] = targetLists.map(list => list.id);
const targetCards: any[] = cards.filter(card => targetListIDs.some(id => id === card.idList));

// Put objects into classes...
let myCards: Trello.Card[] = targetCards.map(card => new Trello.Card(card.name, card.desc));
let myLists: Trello.List[] = targetLists.map(list => new Trello.List(list.name, myCards));
let myDocument: Trello.Document = new Trello.Document(projectName, myLists);

console.log(myDocument.toMarkdown());

fs.writeFileSync(outputFile, myDocument.toMarkdown());
