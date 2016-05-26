#!/usr/bin/env node

'use strict';

import {$: fs} from "fs";
import {$: commander} from "commander";



// CLI options
let inputFile, outputFile, targetListName;
commander
  .arguments('<input> <output> [listname]')
  .option('-n, --newer', 'Only include cards from the past 30 days')
  .option('-o, --open', 'Only include open cards')
  .option('-c, --closed', 'Only include closed cards')
  .action((input, output, listname) => {
    validate(input);
    inputFile = (input.endsWith('.json') ? input : input + '.json');

    if (outputFile) outputFile = (output.endsWith('.md') ? output : output + '.md');

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
const targetLists: any[] = lists
  .filter(list => targetListNames.some(name => name === list.name));

const targetListIDs: string[] = targetLists
  .map(list => list.id);

const targetCards: any[] = cards
  .filter(card => targetListIDs.some(id => id === card.idList))
  .filter(onlyFromLastMonth)
  .filter(openOrClosed);


// Put objects into classes...
let myCards: Trello.Card[] = targetCards
  .map(card => new Trello.Card(card.name, card.desc));
let myLists: Trello.List[] = targetLists
  .map(list => new Trello.List(list.name, myCards));
let myDocument: Trello.Document = new Trello.Document(projectName, myLists);

console.log("\nRendered unto Markdown thusly:\n");
console.log(myDocument.toMarkdown());

if (outputFile) {
  fs.writeFileSync(dir + outputFile, myDocument.toMarkdown());
}


function openOrClosed(card) {
  if (commander.open && commander.closed) return true;
  if (commander.open)   return card.closed !== 'true';
  if (commander.closed) return card.closed === 'true';
  return true;
}

function onlyFromLastMonth(card) {
  if (!commander.newer) return true;
  const base = 10;
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDay() + 1;

  const cardMonth = parseInt(card.dateLastActivity.substring(5, 7), base);
  const cardDay = parseInt(card.dateLastActivity.substring(8, 10), base);

  const isSameMonth     = cardMonth === month;
  const isPreviousMonth = cardMonth === cardMonth - 1;
  const isWithinThirty  = isPreviousMonth && cardDay >= day;
  return isSameMonth || isWithinThirty;
}
