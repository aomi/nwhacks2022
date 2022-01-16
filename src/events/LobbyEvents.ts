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

export interface ChangeGameStateEvent {
    code: string,
    newState: GameState
}