import React, {Component} from 'react'
import {Tournament as TournamentType} from '../../interfaces'
import {Link} from 'react-router-dom'

interface Props {
    tournament: TournamentType
}

class TournamentCard extends Component<Props> {

    render() {
        const tournament = this.props.tournament
        return (
            
                <div className="flex rounded shadow-md hover:shadow-xl m-4 bg-white">
                    <Link to={`/tournaments/${tournament.url}`}>
                    <div className='flex rounded overflow-hidden'>
                        <img 
                            className="w-40 object-cover h-40" 
                            src={tournament.entries[0] ? tournament.entries[0].photo : ""} 
                        />
                        <img 
                            className="w-40 object-cover h-40" 
                            src={tournament.entries[1] ? tournament.entries[1].photo : ""}
                        />
                    </div>
                    <div className="flex flex-grow flex-col justify-between px-4 py-4">
                        <div className="flex items-center justify-between font-bold text-xl mb-2">
                            {tournament.title}
                            <div className="text-xs font-semibold border px-2 py-1 rounded border-green-400">
                                {tournament.num_plays} plays
                            </div>
                        </div>
                        <p className="text-gray-700 text-sm">
                            {tournament.description}
                        </p>
                        <div className="mt-4">
                            {tournament.tags.map((tag, i) => 
                                <span key={i} className="inline-block shadow bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2">
                                    #{tag}
                                </span>
                            )}
                        </div>
                    </div>
                    </Link>
                </div>
        )
    }
}

export default TournamentCard