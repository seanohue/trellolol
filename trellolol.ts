'use strict';
/// <reference path="lib/trelloItems.ts"/>

declare var require: any
const fs = require('fs');
const json2md = require('json2md');



/// Set up us the Trello objects.
const trelloBoard = require('./example.json');
const cards: any[] = trelloBoard.cards;
const lists: any[] = trelloBoard.lists;

//TODO: Pull from board name.
const projectName: string = 'Schmup';

// Organize the Trello objects.
const targetListNames: string[] = ['Technical'];
const targetLists: any[] = lists.filter(list => contains(targetListNames, list.name));
const targetListIDs: string[] = targetLists.map(list => list.id);
const targetCards: any[] = cards.filter(card => contains(targetListIDs, card.idList));

// Put objects into classes...
let myCards: TrelloCard[] = targetCards.map(card => new TrelloCard(card.name, card.desc));
let myLists: TrelloList[] = targetLists.map(list => new TrelloList(list.name, myCards));
let myDocument: TrelloDocument = new TrelloDocument(projectName, myLists);

console.log(myDocument.toMarkdown());

function contains(collection: any[], item: any): boolean
{
  return collection.indexOf(item) > -1;
}
