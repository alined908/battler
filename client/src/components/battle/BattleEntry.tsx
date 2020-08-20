import React, {Component} from 'react'
import {TournamentEntry as TournamentEntryType} from '../../interfaces'

interface BattleEntryProps {
    entry: TournamentEntryType,
    determineBattleWinner?: (entry: TournamentEntryType) => void
}

class BattleEntry extends Component<BattleEntryProps> {
    render () {

        return (
            <div onClick={() => this.props.determineBattleWinner && this.props.determineBattleWinner(this.props.entry)} className="container mx-auto max-w-xs rounded-lg overflow-hidden border my-2 bg-white hover:shadow-lg hover:cursor-pointer">
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

export default BattleEntry