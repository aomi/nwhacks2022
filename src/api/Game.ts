import { DECK_TYPES, GameState } from "../enums/SharedEnums";
import { Card } from "./gameBoardObjects/Card";
import { Pile } from "./gameBoardObjects/Pile";
import { Player } from "./Player";


export class Game  {
    readonly code: string;
    readonly name: string;
    readonly maxPlayers: number;
    players: Player[];
    nextPlayerId: number;
    gameState: GameState;
    piles: Pile[];
    nextAvailableCardId: number;
    
    constructor(code: string, name: string, maxPlayers: number, host: Player) {
        this.code = code;
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.players = [host];
        this.nextPlayerId = 1;
        this.gameState = GameState.LOBBY;
        this.nextAvailableCardId = 0;
    }

    addPlayer(player: Player) {
        if (this.nextPlayerId >= this.maxPlayers || this.gameState != GameState.LOBBY) return;
        this.players.push(player);
        this.nextPlayerId += 1;
    }

    setGameState(newState: GameState) {
        this.gameState = newState;
    }

    resetGame() {
        this.piles = [];
        for (let player in this.players) {
            this.piles.push(new Pile(this.nextPlayerId, DECK_TYPES.EMPTY, false));
        }
    }

    addDeck(deckType: DECK_TYPES, isFaceUp: boolean) {
        this.piles.push(new Pile(this.nextPlayerId, deckType, isFaceUp))
        if (deckType == DECK_TYPES.STANDARD) {
            this.nextAvailableCardId += 52;
        }
    }

    removeDeck(id: number) {
        this.piles.splice(id);
    }

    moveCard(card: Card, srcPileID: number, destPileId: number) {
        const srcPile = this.piles[srcPileID];
        const srcIdx = srcPile.cards.indexOf(card);
        srcPile.cards.splice(srcIdx,1);
        this.piles[destPileId].cards.push(card);
    }
}