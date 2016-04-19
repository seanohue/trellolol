'use strict';

declare var require: any
const fs = require('fs');
const json2md = require('json2md');

class TrelloCard {
  name: string;
  desc: string;

  constructor(name: string, desc: string) {
    this.name = name;
    this.desc = desc;
  }

  toMarkdown(): string {
    return '\n- ' + this.name;
  }
}

class TrelloList {
  name: string;
  cards: TrelloCard[];

  constructor(name: string, cards: TrelloCard[]) {
    this.name = name;
    this.cards = cards;
  }

  stringifyCards(): string[] {
    return this.cards.map(card => card.toMarkdown());
  }

  toJSON(): any {
    return {
      h3: this.name
    };
  }

  toMarkdown(): string {
    return json2md(this.toJSON()) + this.stringifyCards();
  }
}

class TrelloDocument {
  title: string;
  lists: TrelloList[];

  constructor(title: string, lists: TrelloList[]) {
    this.title = title;
    this.lists = lists;
  }

  toJSON(): any {
    return {
      h1: this.title
    };

  }

  toMarkdown(): string {
    let header = json2md(this.toJSON());
    let compiledLists = this.lists.map(list => '\n' + list.toMarkdown());
    return header.concat(compiledLists);
  }
}

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
