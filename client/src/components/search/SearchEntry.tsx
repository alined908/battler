import React, {Component} from 'react'
import {Tournament as TournamentType} from '../../interfaces'
import {Link} from 'react-router-dom'

interface SearchEntryProps {
    tournament: TournamentType
    closeDropdown: () => void
}

class SearchEntry extends Component<SearchEntryProps>{
    render() {
        return (
            <Link to={`/tournaments/${this.props.tournament.url}`} onClick={this.props.closeDropdown}>
                <div className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                    {this.props.tournament.title} - {this.props.tournament.description}
                </div>
            </Link>
        )
    }
}

export default SearchEntry