import React, {Component} from 'react'
import {Game as GameType, Battle as BattleType, Tournament as TournamentType, TournamentEntry as TournamentEntryType} from '../../interfaces'
import {axiosClient} from '../../tools/axiosClient'

interface BattleEntryProps {
    entry: TournamentEntryType,
    determineBattleWinner: (entry: TournamentEntryType) => void
}

class BattleEntry extends Component<BattleEntryProps> {
    render () {
        return (
            <div onClick={() => this.props.determineBattleWinner(this.props.entry)} className="container mx-auto max-w-xs rounded-lg overflow-hidden border my-2 bg-white hover:shadow-lg hover:cursor-pointer">
                <div className="relative mb-6">
                    <img className="w-full" src={this.props.entry.photo}/>
                    <div className="text-center absolute w-full" style={{bottom: -30}}>
                        <div className="mb-10">
                            <p className="text-white tracking-wide uppercase text-lg font-bold">{this.props.entry.title}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

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