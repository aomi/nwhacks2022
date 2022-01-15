import { GameAction } from "./GameAction";

export interface Event {
    eventName: string,
    source: number,
    action?: GameAction 
}