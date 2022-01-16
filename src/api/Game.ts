import { Player } from "./Player";


export class Game  {
    readonly code: string;
    readonly name: string;
    readonly maxPlayers: number;
    players: Player[];
    nextPlayerId: number;
    
    constructor(code: string, name: string, maxPlayers: number, host: Player) {
        this.code = code;
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.players = [host];
        this.nextPlayerId = 1;
    }

    addPlayer(player: Player) {
        if (this.nextPlayerId >= this.maxPlayers) return;
        this.players.push(player);
        this.nextPlayerId += 1;
    }
}