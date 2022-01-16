import { DECK_TYPES, GameState } from "../enums/SharedEnums";
import { Lobby } from "../pages/Lobby";
import { Pile } from "./gameBoardObjects/Pile";
import { Player } from "./Player";


export class Game  {
    readonly code: string;
    readonly name: string;
    readonly maxPlayers: number;
    players: Player[];
    nextPlayerId: number;
    gameState: GameState;
    hands: Pile[];
    board: Pile[];
    
    constructor(code: string, name: string, maxPlayers: number, host: Player) {
        this.code = code;
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.players = [host];
        this.nextPlayerId = 1;
        this.gameState = GameState.LOBBY;
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
        this.hands = [];
        for (let player in this.players) {
            this.hands.push(new Pile(DECK_TYPES.EMPTY));
        }
        this.board = [];
    }
}