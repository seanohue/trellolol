module Trello {
  export class TrelloCard {
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

  export class TrelloList {
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

  export class TrelloDocument {
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
}
