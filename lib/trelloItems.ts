declare var require: any;
const json2md = require('json2md');

export class Card {
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

export class List {
  name: string;
  cards: Card[];

  constructor(name: string, cards: Card[]) {
    this.name = name;
    this.cards = cards;
  }

  stringifyCards(): string {
    return this.cards.map(card => card.toMarkdown()).join('');
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

export class Document {
  title: string;
  lists: List[];

  constructor(title: string, lists: List[]) {
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
