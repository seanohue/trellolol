#!/usr/bin/env node

'use strict';

import { $: fs } from "fs";
import { $: commander } from "commander";

import { md } from "md";


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

    if (outputFile) {
      outputFile = (output.endsWith('.md') ? output : output + '.md');
    }

    targetListName = listname || 'Done';
  })
  .parse(process.argv);

function validate(arg) {
  if (!arg) throw 'You must supply an input and output filename.';
}

/// Set up us the Trello objects.
const dir = process.cwd() + '/';
const trelloBoard = require(dir + inputFile);
const lists = trelloBoard.lists;

// Organize the Trello objects.
// TODO: Allow for multiple list names to be targeted.
const targetListNames = [targetListName];
const targetLists = lists
  .filter(list => targetListNames.some(name => name === list.name));
const targetListIDs = targetLists.map(list => list.id);

const cards = trelloBoard.cards
  .filter(card => targetListIDs.some(id => id === card.idList))
  .filter(onlyFromLastMonth)
  .filter(openOrClosed);

//TODO: Include contrib. names and such.
const renderBoardInfo = board => md.h(1, board.name);

//TODO: Include checklists, card descs, timestamps, tags/categories.
const renderCard = card  => md.li(card.name);
const renderList = cards => cards.map(renderCard).join('');

const write = (dir, file, str) => {
  console.log(str);
  if (dir && file) fs.writeFileSync(dest, str));
}

write(dir, outputFile, renderList(cards));

//TODO: Make into pure funcs
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
