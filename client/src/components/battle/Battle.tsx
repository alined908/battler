import React, {Component} from 'react'
import {Battle as BattleType, TournamentEntry as TournamentEntryType} from '../../interfaces'
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
        console.log(this.props.battle)
        return (
            <div className="flex flex-col flex-grow items-center max-w-screen-xl w-full">

                <div className="mt-24 text-4xl font-semibold mb-24">
                    {`Round of ${this.props.battle.round.round_num}`} - {`Battle ${this.props.battle.battle_index + 1}/${this.props.battle.round.round_num/this.props.battle.entries.length}`}
                </div>
                
                <div className="flex w-full justify-evenly items-center">
                    {this.props.battle.entries.map((entry, i) =>
                        <BattleEntry
                            key={entry.id}
                            entry={entry}
                            determineBattleWinner={this.determineBattleWinner}
                        /> 
                    )}
                </div>
                
            </div>
        )
    }
}

export default Battle