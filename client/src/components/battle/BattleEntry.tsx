import React, {Component} from 'react'
import {TournamentEntry as TournamentEntryType} from '../../interfaces'

interface BattleEntryProps {
    entry: TournamentEntryType
    determineBattleWinner?: (entry: TournamentEntryType) => void
}

class BattleEntry extends Component<BattleEntryProps> {
    render () {
        return (

            <div onClick={() => this.props.determineBattleWinner && this.props.determineBattleWinner(this.props.entry)} className="transition-transform duration-200 ease-out transform hover:-translate-y-3 w-64 mx-2 cursor-pointer max-w-xs rounded-lg shadow-md overflow-hidden my-2 bg-white hover:shadow-xl">
                <div className='rounded overflow-hidden'>
                    <img className="w-64 object-cover h-64" src={this.props.entry.photo}/>
                </div>
                <div className="text-center w-full py-3">
                        <p className="text-sm font-semibold">{this.props.entry.title}</p>
                </div>
                
            </div>
        )
    }
}

export default BattleEntry