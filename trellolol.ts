#!/usr/bin/env node

'use strict';
declare var require: any;
declare var process: any;

/// <reference path="lib/trelloItems.ts"/>
import Trello = require('./lib/trelloItems');

const fs = require('fs');
const commander = require('commander');

// Defaults
let inputFile;
let outputFile;
let targetListName;

// CLI options
commander
  .arguments('<input> <output> [listname]')
  .option('-a, --archived', 'Include archived cards')
  .action((input, output, listname) => {
    [input, output].forEach(validate);
    inputFile = (input.endsWith('.json') ? input : input + '.json');
    outputFile = (output.endsWith('.md') ? output : output + '.md');
    targetListName = listname || 'Done';
  })
  .parse(process.argv);

function validate(arg) {
  if (!arg) throw 'You must supply an input and output filename.';
}

/// Set up us the Trello objects.
//TODO: Allow for dynamic call to Trello API via an option?
const dir = process.cwd() + '/';
const trelloBoard = require(dir + inputFile);
const cards: any[] = trelloBoard.cards;
const lists: any[] = trelloBoard.lists;

//TODO: Pull from board name.
const projectName: string = trelloBoard.name || 'Project';

// Organize the Trello objects.
// TODO: Allow for multiple list names to be targeted.
const targetListNames: string[] = [targetListName];
const targetLists: any[] = lists.filter(list => targetListNames.some(name => name === list.name));
const targetListIDs: string[] = targetLists.map(list => list.id);
const targetCards: any[] = cards.filter(card => targetListIDs.some(id => id === card.idList))
                                .filter(card => commander.archived ? true : card.closed === 'true');

// Put objects into classes...
let myCards: Trello.Card[] = targetCards.map(card => new Trello.Card(card.name, card.desc));
let myLists: Trello.List[] = targetLists.map(list => new Trello.List(list.name, myCards));
let myDocument: Trello.Document = new Trello.Document(projectName, myLists);

console.log("\nRendered unto Markdown thusly:\n");
console.log(myDocument.toMarkdown());

fs.writeFileSync(dir + outputFile, myDocument.toMarkdown());
