'use strict';
/// <reference path="lib/trelloItems.ts"/>
declare var require: any;

import Trello = require('./lib/trelloItems');

const fs = require('fs');

/// Set up us the Trello objects.
const trelloBoard = require('./example.json');
const cards: any[] = trelloBoard.cards;
const lists: any[] = trelloBoard.lists;

//TODO: Pull from board name.
const projectName: string = 'Schmup';

// Organize the Trello objects.
const targetListNames: string[] = ['Adding game features'];
const targetLists: any[] = lists.filter(list => contains(targetListNames, list.name));
const targetListIDs: string[] = targetLists.map(list => list.id);
const targetCards: any[] = cards.filter(card => contains(targetListIDs, card.idList));

// Put objects into classes...
let myCards: Trello.Card[] = targetCards.map(card => new Trello.Card(card.name, card.desc));
let myLists: Trello.List[] = targetLists.map(list => new Trello.List(list.name, myCards));
let myDocument: Trello.Document = new Trello.Document(projectName, myLists);

console.log(myDocument.toMarkdown());

fs.writeFileSync('./example.md', myDocument.toMarkdown());

function contains(collection: any[], item: any): boolean
{
  return collection.indexOf(item) > -1;
}
