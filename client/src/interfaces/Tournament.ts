import {User} from './index'

export interface TournamentEntry {
    id: number,
    tournament: string,
    title: string,
    photo: string
}

export interface Tournament {
    id: string,
    title: string,
    description: string,
    is_nsfw: boolean,
    privacy: number,
    creator: User,
    entries: TournamentEntry[]
    created_at: string,
    updated_at: string
}