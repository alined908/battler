import React, {Component} from 'react'
import {TournamentEntry as TournamentEntryType} from '../../interfaces'

interface BattleEntryProps {
    entry: TournamentEntryType,
    determineBattleWinner?: (entry: TournamentEntryType) => void
}

class BattleEntry extends Component<BattleEntryProps> {
    render () {

        return (
            <div onClick={() => this.props.determineBattleWinner && this.props.determineBattleWinner(this.props.entry)} className="mx-2 container cursor-pointer max-w-xs rounded-lg overflow-hidden border my-2 bg-white hover:shadow-xl">

                <img className="w-full" src={this.props.entry.photo}/>
                <div className="text-center w-full py-3">
                        <p className="text-sm font-semibold">{this.props.entry.title}</p>
                </div>
                
            </div>
        )
    }
}

export default BattleEntry