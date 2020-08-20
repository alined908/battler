import React, {Component} from 'react'
import {Game as GameType, Battle as BattleType, Tournament as TournamentType, TournamentEntry as TournamentEntryType} from '../../interfaces'
import {axiosClient} from '../../tools/axiosClient'
import {BattleEntry} from '../components'

interface BattleProps {
    tournamentID: string, 
    battle: BattleType,
    advanceNextBattle: () => void
}

interface BattleState {

}

class Battle extends Component<BattleProps, BattleState> {

    state : BattleState = {

    }

    determineBattleWinner = (entry: TournamentEntryType) => {
        axiosClient.request({
            url: `api/tournaments/${this.props.tournamentID}/battle/${this.props.battle.id}/`,
            method: 'PATCH',
            data: {
                winner: entry.id
            }
        }).then((response) => {
            console.log(response.data)
            this.props.advanceNextBattle()
        }).catch((error) => {
            console.log(error)
        })
    }

    render () {
        return (
            <div className="flex">
                {this.props.battle.entries.map((entry) =>
                    <BattleEntry 
                        entry={entry}
                        determineBattleWinner={this.determineBattleWinner}
                    /> 
                )}
            </div>
        )
    }
}

export default Battle