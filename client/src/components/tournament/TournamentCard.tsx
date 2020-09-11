import React, {Component} from 'react'
import {Tournament as TournamentType} from '../../interfaces'
import {Link} from 'react-router-dom'

const QuestionMark = () => <div className='w-40 h-40 flex items-center justify-center'>
        <svg viewBox="0 0 20 20" fill="currentColor" className="question-mark-circle w-6 h-6"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>
    </div>

interface Props {
    tournament: TournamentType
}

class TournamentCard extends Component<Props> {

    render() {
        const tournament = this.props.tournament
        return (
            
                <div className="transition-transform duration-200 ease-out transform hover:-translate-y-3 flex rounded shadow-md hover:shadow-xl m-4 bg-white">
                    <Link to={`/tournaments/${tournament.url}`}>
                        <div className='flex rounded overflow-hidden'>
                            {tournament.entries[0] ?
                                <img 
                                    className="w-40 object-cover h-40" 
                                    src={tournament.entries[0].photo} 
                                />
                                :
                                <QuestionMark/>
                            }
                            {tournament.entries[1] ?
                                <img 
                                    className="w-40 object-cover h-40" 
                                    src={tournament.entries[1].photo} 
                                />
                                :
                                <QuestionMark/>
                            }
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
                                    <span key={i} className="inline-block shadow-sm bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2">
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