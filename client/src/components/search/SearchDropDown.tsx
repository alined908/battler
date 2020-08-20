import React, {Component} from 'react'
import {Tournament as TournamentType} from '../../interfaces'
import {SearchEntry} from '../components'

interface SearchDropDownProps {
    tournaments: TournamentType[],
    closeDropdown: () => void
}

class SearchDropDown extends Component<SearchDropDownProps> {
    render () {
        return (
            <div className="w-full absolute rounded-md shadow-lg mt-3" style={{top: '100%'}}>
                <div className="rounded-md bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <div className="py-1">
                        {this.props.tournaments.map((tournament) => 
                            <SearchEntry 
                                tournament={tournament}
                                closeDropdown={this.props.closeDropdown}
                            />
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchDropDown