import { DECK_TYPES } from "../enums/SharedEnums";

export interface AddDeckEvent {
    code: string,
    deckType: DECK_TYPES
}

export interface RemoveDeckEvent {
    code: string,
    pileId: number
}

export interface ShuffleEvent {
    code: string,
    pileId: number
}