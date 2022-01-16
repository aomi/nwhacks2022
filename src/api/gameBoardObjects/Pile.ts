import { DECK_TYPES, Suit } from "../../enums/SharedEnums";
import { Card } from "./Card";

export class Pile {
  cards: Card[];
  isFaceUp: boolean;

  constructor(
    nextAvailableId: number,
    deckType: DECK_TYPES,
    isFaceUp: boolean,
    shuffle: boolean = true
  ) {
    this.isFaceUp = isFaceUp;
    switch (deckType) {
      case DECK_TYPES.EMPTY: {
        this.cards = [];
        break;
      }
      case DECK_TYPES.STANDARD: {
        this.cards = [];
        for (let i = 0; i < 13; i++) {
          this.cards.push(new Card(i, Suit.SPADES, nextAvailableId + i));
        }
        for (let i = 0; i < 13; i++) {
          this.cards.push(new Card(i, Suit.DIAMONDS, nextAvailableId + 13 + i));
        }
        for (let i = 0; i < 13; i++) {
          this.cards.push(new Card(i, Suit.CLUBS, nextAvailableId + 26 + i));
        }
        for (let i = 0; i < 13; i++) {
          this.cards.push(new Card(i, Suit.HEARTS, nextAvailableId + 39 + i));
        }
        break;
      }
      default:
        break;
    }
    if (shuffle) {
      this.shuffle();
    }
  }

  shuffle() {
    this.cards = this.cards
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
}
