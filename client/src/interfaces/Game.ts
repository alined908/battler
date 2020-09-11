import {TournamentEntry, Tournament} from './index'


export interface Round {
    id: number,
    game: number | Game,
    round_num: number,
    battles: Battle[]
}

export interface Battle {
    entries: TournamentEntry[],
    id: number,
    winner: string | null,
    round: Round,
    battle_index: number,
}

export interface Game {
    id: number,
    tournament: Tournament | string,
    bracket_size: number,
    curr_round: number,
    winner: TournamentEntry | null,
    battles: Battle[],
    bracket?: Round[], 
    battle_size: number,
    curr_battle: number,
    created_at: string,
    updated_at: string
}