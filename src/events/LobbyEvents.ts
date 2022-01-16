import { GameState } from "../enums/SharedEnums"

export interface CreateEvent {
    gameName: string,
    maxPlayuers: number,
    playerName: string
}

export interface JoinEvent {
    code: string,
    playerName: string
}

// This event is for going into the game config state, starting a game, and retunring to a lobby.
export interface ChangeGameStateEvent {
    code: string,
    newState: GameState
}