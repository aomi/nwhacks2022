import { DECK_TYPES } from "../enums/SharedEnums";
import { Card } from "../api/gameBoardObjects/Card";

export interface AddDeckEvent {
    code: string,
    deckType: DECK_TYPES,
    isFaceUp: boolean
}

export interface RemoveDeckEvent {
    code: string,
    pileId: number
}

export interface ShuffleEvent {
    code: string,
    pileId: number
}

export interface MoveCardEvent {
    code: string,
    srcPileId: number,
    destPileId: number,
    card: Card
}