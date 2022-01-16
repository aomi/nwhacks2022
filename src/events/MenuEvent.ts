
export interface CreateEvent {
    gameName: string,
    maxPlayuers: number,
    playerName: string
}

export interface JoinEvent {
    code: string,
    playerName: string
}