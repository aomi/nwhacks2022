import { GameState } from "../enums/SharedEnums";
import { Game } from "./Game";
import { Player } from "./Player";

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const getRandomCharacterCode = () => {
    let result = "";
    for (let i=0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random()*26));
    }
    return result;
}

export class GameManager {
    activeGames: Map<string, Game>;

    constructor() {
        this.activeGames = new Map();
    }

    addGame(gameName: string, maxPlayers: number, playerName: string) {
        let code: string;
        do {
            code = getRandomCharacterCode();
        } while (this.activeGames.has(code));

        const hostPlayer = new Player(playerName, 0);
        const newGame = new Game(code, gameName, maxPlayers, hostPlayer);
        this.activeGames.set(code, newGame);
        return newGame;
    }

    joinGame(code: string, playerName: string) {
        if (!this.activeGames.has(code)) return null;
        const game = this.activeGames.get(code);
        if (!(game.nextPlayerId < game.maxPlayers)) return null;
        const joiningPlayer = new Player(playerName, game.nextPlayerId)
        game.addPlayer(joiningPlayer)
        return game;
    }

    setGameState(code: string, newState: GameState) {
        const game = this.activeGames.get(code);
        game.setGameState(newState);
        switch(newState) {
            case GameState.LOBBY: {
                break;
            }            
            case GameState.GAME_CONFIG: {
                game.resetGame()
                break;
            }
            case GameState.GAMEPLAY: {
                break;
            }
            default: {
                break;
            }
        }
        return game;
    }

}