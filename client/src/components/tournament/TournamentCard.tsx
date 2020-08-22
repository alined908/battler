import React, {Component} from 'react'
import {Tournament as TournamentType} from '../../interfaces'
import {Link} from 'react-router-dom'

interface Props {
    tournament: TournamentType
}

class TournamentCard extends Component<Props> {

    render() {

        return (
            <Link to={`/tournaments/${this.props.tournament.url}`}>
                <div className="max-w-sm rounded border hover:border-transparent hover:shadow-lg bg-white">
                    {/* <img className="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains"/> */}
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">{this.props.tournament.title}</div>
                        <p className="text-gray-700 text-base">
                            {this.props.tournament.description}
                        </p>
                    </div>
                    <div className="px-6 py-4">
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#Tag1</span>
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#Tag2</span>
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">#Tag3</span>
                    </div>
                </div>
            </Link>
        )
    }
}

export default TournamentCard