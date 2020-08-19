import {TournamentEntry} from './index'

export interface Battle {
    entries: TournamentEntry[],
    id: number,
    winner: string | null
}

export interface Game {
    id: number,
    tournament: string,
    bracket_size: number,
    curr_round: number,
    winner: string | null,
    battles: Battle[],
    curr_battle: number,
    created_at: string,
    updated_at: string
}