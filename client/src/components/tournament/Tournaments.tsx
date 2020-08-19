import React, {Component} from 'react'
import {Tournament as TournamentType} from '../../interfaces'
import {TournamentCard} from '../components'
import {axiosClient} from '../../tools/axiosClient'

interface TournamentsProps {}

interface TournamentsState {
    tournaments: TournamentType[]
}

class Tournaments extends Component<TournamentsProps, TournamentsState> {

    state: TournamentsState = {
        tournaments: []
    }

    componentDidMount() : void {
        axiosClient.request({
            url: 'api/tournaments/',
            method: 'GET',
        }).then((response) => {
            console.log(response.data)
            this.setState({
                tournaments: response.data
            })
        }).catch((error) => {
            console.log(error)
        })
    }

    render() {
        return (
            <div className="container mx-auto py-8 px-4">
                {this.state.tournaments.map((tournament) => 
                    <TournamentCard
                        key={tournament.id}
                        tournament={tournament}
                    />
                )}
            </div>
        )
    }
}

export default Tournaments