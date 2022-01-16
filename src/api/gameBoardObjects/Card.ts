import { Suit } from "../../enums/SharedEnums";

export class Card {
  readonly value: number;
  readonly suit: Suit;
  readonly id: number;

  constructor(value: number, suit: Suit, id: number) {
    this.value = value;
    this.suit = suit;
    this.id = id;
  }
}
