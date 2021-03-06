import { DECK_TYPES, GameState } from "../enums/SharedEnums";
import { Card } from "./gameBoardObjects/Card";
import { Pile } from "./gameBoardObjects/Pile";
import { Player } from "./Player";

export class Game {
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
    this.piles = [new Pile(0, DECK_TYPES.EMPTY, false)];
    host.handId = 0;
    this.players = [host];
    this.nextPlayerId = 1;
    this.gameState = GameState.LOBBY;
    this.nextAvailableCardId = 0;
  }

  addPlayer(player: Player) {
    if (
      this.nextPlayerId >= this.maxPlayers ||
      this.gameState != GameState.LOBBY
    )
      return;
    this.piles.push(new Pile(this.nextPlayerId, DECK_TYPES.EMPTY, false));
    player.handId = this.piles.length-1;
    this.players.push(player);
    this.nextPlayerId += 1;
  }

  setGameState(newState: GameState) {
    this.gameState = newState;
  }

  resetGame() {
    this.piles = [];
    this.nextAvailableCardId = 0;
    for (let i = 0; i < this.players.length; i++) {
      this.piles.push(new Pile(this.nextAvailableCardId, DECK_TYPES.EMPTY, false));
      this.players[i].handId = i;
    }
  }

  addDeck(deckType: DECK_TYPES, isFaceUp: boolean, isFanned?: boolean) {
    this.piles.push(new Pile(this.nextPlayerId, deckType, isFaceUp, isFanned));
    if (deckType == DECK_TYPES.STANDARD) {
      this.nextAvailableCardId += 52;
    }
  }

  removeDeck(id: number) {
    this.piles.splice(id);
  }

  moveCard(targetCard: Card, srcPileID: number, destPileId: number) {
    const srcPile = this.piles[srcPileID];
    if (targetCard == undefined) return;
    const srcIdx = srcPile.cards.findIndex(card => targetCard.id === card.id);
    srcPile.cards.splice(srcIdx, 1);
    this.piles[destPileId].cards.push(targetCard);
  }

  deal(srcPileId: number, handSize: number) {
    let playerIdx = 0;
    const srcPile = this.piles[srcPileId];
    let cardsDealt = 0;
    while (srcPile.cards.length > 0 && cardsDealt < handSize*this.players.length) {
        let card = srcPile.cards.pop();
        let playerHand = this.piles[this.players[playerIdx].handId]
        playerHand.cards.push(card);
        playerIdx = (playerIdx + 1) % this.players.length;
        cardsDealt += 1;
    }
  }
}
