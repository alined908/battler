import {User} from './index'

export interface TournamentEntry {
    id: number,
    tournament: string,
    title: string,
    photo: string,
    created_at: string,
    updated_at: string
}

export interface Tournament {
    id: number,
    url: string,
    title: string,
    avatar: string,
    description: string,
    is_nsfw: boolean,
    privacy: number,
    creator: User,
    entries: TournamentEntry[]
    created_at: string,
    updated_at: string,
    num_plays: number,
    tags: string[]
}