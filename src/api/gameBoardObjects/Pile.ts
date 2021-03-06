import { DECK_TYPES, Suit } from "../../enums/SharedEnums";
import { Card } from "./Card";

export class Pile {
  cards: Card[];
  isFaceUp: boolean;
  isSpread: boolean;

  constructor(
    nextAvailableId: number,
    deckType: DECK_TYPES,
    isFaceUp: boolean,
    isSpread: boolean = false
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
    this.shuffle();
    this.isSpread = isSpread;
  }

  shuffle() {
    this.cards = this.cards
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
}
