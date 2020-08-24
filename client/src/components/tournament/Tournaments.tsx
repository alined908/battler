import React, {Component} from 'react'
import {Tournament as TournamentType} from '../../interfaces'
import {TournamentCard, SearchBar} from '../components'
import {axiosClient} from '../../tools/axiosClient'
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";
import moment, {Moment} from 'moment'

const dateFilter = {
    today: moment().format('YYYY-MM-DD'),
    week: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    month: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    all: ''
}

enum defaultFilter {
    Popular = 'num_plays',
    Recent = 'created_at'
}

interface SearchParams {
    query: string
    tags: string[]
    dateFilter: string,
    defaultFilter: defaultFilter
}

interface TournamentsProps {}

interface TournamentsState {
    tournaments: TournamentType[]
    popularTags: string[]
    clickedTags: boolean[]
    search: SearchParams
}

class Tournaments extends Component<TournamentsProps, TournamentsState> {

    searchDebounced : () => void
    searchThrottled: () => void

    constructor(props: TournamentsProps) {
        super(props)
        this.state = {
            tournaments: [],
            popularTags: [],
            clickedTags: [],
            search: {
                query: '',
                tags: [],
                dateFilter: dateFilter.all,
                defaultFilter: defaultFilter.Popular
            }
        }
        
        this.searchDebounced = debounce(this.callSearch, 500);
        this.searchThrottled = throttle(this.callSearch, 500);
    }
 

    componentDidMount() : void {
        axiosClient.request({
            url: 'api/tournaments/',
            method: 'GET',
        }).then((response) => {
            console.log(response.data)
            this.setState({
                tournaments: response.data.tournaments,
                popularTags: response.data.tags,
                clickedTags: new Array(response.data.tags.length).fill(false)
            })
        }).catch((error) => {
            console.log(error)
        })
    }

    callSearch = () => {

        axiosClient.request({
            url: 'api/search/tournaments/',
            method: 'GET',
            params: {
                q: this.state.search.query,
                filter: this.state.search.defaultFilter,
                ...(this.state.search.tags.length !== 0) && {tags: this.state.search.tags},
                ...(this.state.search.dateFilter !== dateFilter.all) && {date: this.state.search.dateFilter},
            }
        }).then((response) => {
            console.log(response.data)
            this.setState({
                tournaments: response.data
            })
        }).catch((error) => {
            console.log(error)
        })
    }

    handleQuery = (query: string) => {
        this.setState({search: {...this.state.search, query}}, () => this.callSearch())
    }

    handleDefaultFilter = (defaultFilter: defaultFilter) => {
        if (this.state.search.defaultFilter !== defaultFilter) {
            this.setState({search: {...this.state.search, defaultFilter: defaultFilter}}, () => this.callSearch())
        }
    }

    handleDateFilter = (date: string) => {
        if (this.state.search.dateFilter !== date){
            this.setState({search: {...this.state.search, dateFilter: date}}, () => this.callSearch())
        }
    }

    handleTags = (i: number) => {
        let newClickedTags = [...this.state.clickedTags]
        newClickedTags[i] = !newClickedTags[i]
        let newTags = this.state.popularTags.filter((tag, index) => newClickedTags[index])

        this.setState({clickedTags: newClickedTags, search: {...this.state.search, tags: newTags}}, () => this.callSearch())
    }

    removeTag = (tag: string) => {
        const index = this.state.popularTags.indexOf(tag)
        this.handleTags(index)
    }

    render() {
        return (
            <div className="p-8 flex flex-grow">
                <div className="flex flex-col min-h-full w-64 rounded border-r pr-8">
                    
                    <div className="flex mt-8 flex-col">
                        <h3 className='font-bold'>Filters</h3>
                        <div className='flex mt-4'>
                            <button style={{maxHeight: 38}} onClick={() => this.handleDefaultFilter(defaultFilter.Popular)} className={`${this.state.search.defaultFilter === defaultFilter.Popular && 'bg-green-400 text-white'} flex items-center bg-white hover:bg-green-400 hover:text-white text-sm font-semibold py-2 px-3 shadow-md rounded mr-4`}>
                                Most Played
                            </button>
                            <button style={{maxHeight: 38}} onClick={() => this.handleDefaultFilter(defaultFilter.Recent)} className={`${this.state.search.defaultFilter === defaultFilter.Recent && 'bg-green-400 text-white'} flex items-center bg-white hover:bg-green-400 hover:text-white text-sm font-semibold py-2 px-3 shadow-md rounded`}>
                                Latest
                            </button>
                        </div>
                    </div>
                    <div className="flex mt-8 flex-col">
                        <h3 className='font-bold'>Date</h3>
                        <div className='flex mt-4'>
                            <button onClick={() => this.handleDateFilter(dateFilter.all)} style={{maxHeight: 38}} className={`${this.state.search.dateFilter === dateFilter.all && 'bg-green-400 text-white'} flex items-center bg-white hover:bg-green-400 hover:text-white text-sm font-semibold py-2 px-3 shadow-md rounded mr-4`}>
                                All
                            </button>
                            <button onClick={() => this.handleDateFilter(dateFilter.week)} style={{maxHeight: 38}} className={`${this.state.search.dateFilter === dateFilter.week && 'bg-green-400 text-white'} flex items-center bg-white hover:bg-green-400 hover:text-white text-sm font-semibold py-2 px-3 shadow-md rounded mr-4`}>
                                Week
                            </button>
                            <button onClick={() => this.handleDateFilter(dateFilter.month)} style={{maxHeight: 38}} className={`${this.state.search.dateFilter === dateFilter.month && 'bg-green-400 text-white'} flex items-center bg-white hover:bg-green-400 hover:text-white text-sm font-semibold py-2 px-3 shadow-md rounded`}>
                                Month
                            </button>
                        </div> 
                    </div>
                    <div className="flex mt-8 flex-col">
                        <h3 className='font-bold'>Popular Tags</h3>
                        <div className='flex items-center mt-4 flex-wrap'>
                            {this.state.popularTags.map((tag, i) => 
                                <div 
                                    key={i} 
                                    onClick={() => this.handleTags(i)}
                                    className={`${this.state.clickedTags[i] && 'bg-green-400 text-white'} cursor-pointer flex items-center bg-white hover:bg-green-400 hover:text-white text-sm font-semibold py-2 px-3 shadow-md rounded mr-4 mb-4`}
                                >
                                    #{tag}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="ml-8 flex-grow">
                    <div className="flex items-center justify-center pb-4 mb-8">
                        <SearchBar 
                            handleQuery={this.handleQuery}
                            tags={this.state.search.tags}
                            removeTag={this.removeTag}
                        />
                    </div>
                    <div className="flex flex-wrap items-stretch">
                        {this.state.tournaments.map((tournament) => 
                            <TournamentCard
                                key={tournament.id}
                                tournament={tournament}
                            />
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Tournaments