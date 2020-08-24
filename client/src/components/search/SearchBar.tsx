import React, {Component} from 'react'

interface SearchProps {
    tags: string[]
    handleQuery: (query: string) => void
    removeTag: (tag: string) => void
}

interface SearchState {
    query: string
}

class SearchBar extends Component<SearchProps, SearchState> {

    state: SearchState = {
        query: ''
    }

    changeQuery = (event: React.FormEvent<HTMLInputElement>): void => {
        const query = event.currentTarget.value
        this.setState({query}, () => this.props.handleQuery(this.state.query))
    }

    render () {
        return (
            <div className="relative inline-block flex flex-grow max-w-xl">
                <div className="bg-white max-w-xl rounded flex w-full px-3 py-3 border-gray-200 mx-auto  shadow-md items-center">
                    <svg className="w-5 text-gray-600 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <div className='flex items-center ml-4'>
                        {this.props.tags.map((tag, i) => 
                            <div 
                                key={i} 
                                className={`bg-white bg-green-400 text-white flex items-center text-xs font-bold py-2 pr-3 pl-1 rounded shadow-md justify-between mr-2`}
                            >
                                <span className="cursor-pointer mr-2">
                                    <svg id="close-button" onClick={() => this.props.removeTag(tag)} className="ml-2 h-2 w-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 375">
                                        <g ill-rule="nonzero">
                                            <path d="M368.663 339.414L35.873 6.624c-8.076-8.076-21.172-8.076-29.249 0-8.076 8.077-8.076 21.173 0 29.25l332.79 332.79c8.078 8.076 21.172 8.076 29.25 0 8.076-8.078 8.076-21.172 0-29.25z"></path><path d="M339.414 6.624L6.624 339.414c-8.076 8.077-8.077 21.172 0 29.25 8.078 8.076 21.173 8.076 29.25 0l332.79-332.79c8.076-8.078 8.076-21.172 0-29.25-8.078-8.077-21.172-8.077-29.25 0z">
                                            </path>
                                        </g>
                                    </svg>
                                </span>
                                #{tag}
                            </div>
                        )}
                    </div>
                    
                    <input 
                        type="search" 
                        name="" 
                        onChange={this.changeQuery}
                        placeholder="Search tournaments.."
                        value={this.state.query}
                        className="h-8 w-full pl-4 text-sm outline-none focus:outline-none bg-transparent"
                    />
                </div>
            </div>
            
        )
    }
}

export default SearchBar