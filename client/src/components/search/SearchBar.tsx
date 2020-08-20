import React, {Component} from 'react'
import {axiosClient} from '../../tools/axiosClient'
import {Tournament as TournamentType} from '../../interfaces'
import {SearchDropDown} from '../components'
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";

interface SearchProps {}

interface SearchState {
    query: string,
    tournaments: TournamentType[]
    showDropdown: boolean,
    cachedSearches: string[]
}

class SearchBar extends Component<SearchProps, SearchState> {

    cachedResults : {[key: string]: [];} 
    searchDebounced : () => void
    searchThrottled: () => void

    constructor(props : SearchProps) {
        super(props)
        this.state = {
            query: "",
            tournaments: [],
            showDropdown: true,
            cachedSearches: []
        }
        this.searchDebounced = debounce(this.callSearch, 500);
        this.searchThrottled = throttle(this.callSearch, 500);
        this.cachedResults = {};
    }

    callSearch = () => {
        const cachedResult = this.cachedResults[this.state.query]

        if (cachedResult) {
            this.setState({tournaments: cachedResult})
            return;
        }

        axiosClient.request({
            url:  `api/search/tournaments/`,
            method: 'GET',
            params: {
                q: this.state.query
            }
        }).then((response) => {
            console.log(response.data)
            this.cachedResults[this.state.query] = response.data
            this.setState({tournaments: response.data, showDropdown: true})
            
        }).catch((error) => {
            console.log(error)
        })
    }

    closeDropDown = () => {
        this.setState({showDropdown: false})
    }

    changeQuery = (event: React.FormEvent<HTMLInputElement>): void => {
        const query = event.currentTarget.value
        this.setState({query, showDropdown: query.length > 0 ? true : false}, () => this.callSearch())
    }

    render () {
        return (
            <div className="relative inline-block flex-grow max-w-md">
                <div className="bg-white max-w-md rounded flex w-full p-3 shadow-sm border border-gray-200 mx-auto">
                    <svg className=" w-5 text-gray-600 h-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input 
                        type="search" 
                        name="" 
                        onChange={this.changeQuery}
                        placeholder="Search tournaments.."
                        value={this.state.query}
                        className="w-full pl-4 text-sm outline-none focus:outline-none bg-transparent"
                    />
                </div>
                {this.state.tournaments.length > 0 && this.state.showDropdown && 
                    <SearchDropDown 
                        tournaments={this.state.tournaments}
                        closeDropdown={this.closeDropDown}
                    />
                }
            </div>
            
        )
    }
}

export default SearchBar