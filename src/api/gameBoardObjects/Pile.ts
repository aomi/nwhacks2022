import { DECK_TYPES, Suit } from "../../enums/SharedEnums";
import { Card } from "./Card";

export class Pile {
    cards: Card[];
    name: string;
    isFaceUp: boolean;
    
    constructor(deckType: DECK_TYPES, shuffle: boolean = true) {
        switch(deckType) {
            case DECK_TYPES.EMPTY: {
                this.cards = [];
                break;
            }
            case DECK_TYPES.STANDARD: {
                this.cards = [];
                for (let i = 0; i < 13; i++) {
                    this.cards.push(new Card(i, Suit.SPADES));
                }
                for (let i = 0; i < 13; i++) {
                    this.cards.push(new Card(i, Suit.DIAMONDS));
                }                
                for (let i = 0; i < 13; i++) {
                    this.cards.push(new Card(i, Suit.CLUBS));
                }                
                for (let i = 0; i < 13; i++) {
                    this.cards.push(new Card(i, Suit.HEARTS));
                }
                break;   
            }
            default: break;
        }
        if (shuffle) {
            this.shuffle();
        }
    }

    shuffle() {
        this.cards = this.cards.map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
    }
}