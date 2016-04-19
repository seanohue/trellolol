'use strict';

declare var require: any
const fs = require('fs');
const toMD = require('json2md');

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

console.log(targetCards);

/*
  h1: projectName
  h3: targetListName
      ul:
        cardName
        cardDesc
*/

class TrelloCard {
  name: string;
  desc: string;

  constructor(name: string, desc: string) {
    this.name = name;
    this.desc = desc;
  }

  toJSON() {
    return '';// Do stuff here
  }
}

class TrelloList {
  name: string;
  cards: string[];

  constructor(name: string) {
    this.name = name;
  }
  addCard(card: TrelloCard) {
    this.cards.push(card.toJSON())
  }
  toJSON() {
    // Do stuff here
  }
}


function contains(collection: any[], item: any): boolean
{
  return collection.indexOf(item) > -1;
}
