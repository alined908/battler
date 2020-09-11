import React, {Component} from 'react'
import {axiosClient} from '../../tools/axiosClient'
import {Game, Tournament} from '../../interfaces'
import {connect} from 'react-redux'

interface PastGameProps {
    game: Game
}

class PastGame extends Component<PastGameProps>{
    render() {
        const game = this.props.game
        const tournament = game.tournament as Tournament

        return (
            <div className='h-48 flex min-w-full mb-12'>
                <div className="flex flex-col items-center">
                    <div className="rounded overflow-hidden shadow w-20 h-20">
                        <img src={tournament.avatar} className="w-20 object-cover h-20"/>
                    </div>
                    <div className="mt-2 text-lg font-semibold">
                        {tournament.title}
                    </div>
                </div>
                <div className="flex-grow shadow bg-white rounded mx-6">
                    <div>
                        Status: {game.winner ? 'Completed': 'In Progress'}
                    </div>
                    <div>
                        Date: {game.created_at}
                    </div>
                    <div>
                        Battle Size: {game.battle_size}
                        Bracket Size: {game.bracket_size}
                    </div>
                    {!game.winner &&
                        <div>
                            Current Battle: {game.battles[game.curr_battle].entries[0].title} vs {game.battles[game.curr_battle].entries[1].title}
                        </div>
                    }
                    {game.winner && 
                        <div>
                            Winner
                            <div className="rounded overflow-hidden shadow w-36 h-36">
                                <img src={game.winner.photo} className="w-36 object-cover h-36"/>
                            </div>
                        </div>
                    }
                    
                </div>
                <div className="flex flex-col items-start">
                    <button style={{maxHeight: 38}} className="flex items-center bg-white hover:bg-gray-100 text-green-500 text-sm font-semibold py-2 px-3 shadow rounded mb-3">
                        <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" version="1.1">
                            <g id="surface1">
                                <path style={{fill:"#48bb78",strokeWidth:"32",strokeLinecap:"butt",strokeLinejoin:"miter",stroke: "-moz-initialrgb(0%,0%,0%)",strokeOpacity: 1,strokeMiterlimit:10}} d="M 112 111 L 112 401 C 112 418.444444 129 429.555556 143 421.111111 L 390.888889 272.777778 C 403 265.555556 403 246.444444 390.888889 239.222222 L 143 90.888889 C 129 82.444444 112 93.555556 112 111 Z M 112 111 " transform="matrix(0.0351562,0,0,0.0351562,0,0)"/>
                            </g>
                        </svg>
                        Play Again
                    </button>
                    <button className="mr-2 flex items-center bg-white hover:bg-gray-100 text-blue-500 text-sm font-semibold py-2 px-3 shadow rounded mb-3">
                        <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" version="1.1">
                            <g id="surface1">
                                <path style={{fill:"#4299e1",strokeWidth:"32",strokeLinecap:"round",strokeLinejoin:"round",stroke: "-moz-initialrgb(0%,0%,0%)",strokeOpacity: 1,strokeMiterlimit:4}} d="M 364.111111 125.222222 L 87 403 L 64 448 L 109 425 L 386.777778 147.888889 Z M 364.111111 125.222222 " transform="matrix(0.0351562,0,0,0.0351562,0,0)"/>
                                <path style={{fill:"#4299e1",strokeWidth:"32",strokeLinecap:"round",strokeLinejoin:"round",stroke: "-moz-initialrgb(0%,0%,0%)",strokeOpacity: 1,strokeMiterlimit:4}} d="M 420.666667 68.666667 L 398.111111 91.333333 L 420.666667 113.888889 L 443.333333 91.333333 C 449.555556 85.111111 449.555556 74.888889 443.333333 68.666667 C 437.111111 62.444444 426.888889 62.444444 420.666667 68.666667 Z M 420.666667 68.666667 " transform="matrix(0.0351562,0,0,0.0351562,0,0)"/>
                            </g>
                        </svg>
                        Bracket
                    </button>
                    <button className="mr-2 flex items-center bg-white hover:bg-gray-100 text-red-500 text-sm font-semibold py-2 px-3 shadow rounded mb-3">
                        <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" version="1.1">
                            <g id="surface1">
                                <path style={{fill:"#4299e1",strokeWidth:"32",strokeLinecap:"round",strokeLinejoin:"round",stroke: "-moz-initialrgb(0%,0%,0%)",strokeOpacity: 1,strokeMiterlimit:4}} d="M 364.111111 125.222222 L 87 403 L 64 448 L 109 425 L 386.777778 147.888889 Z M 364.111111 125.222222 " transform="matrix(0.0351562,0,0,0.0351562,0,0)"/>
                                <path style={{fill:"#4299e1",strokeWidth:"32",strokeLinecap:"round",strokeLinejoin:"round",stroke: "-moz-initialrgb(0%,0%,0%)",strokeOpacity: 1,strokeMiterlimit:4}} d="M 420.666667 68.666667 L 398.111111 91.333333 L 420.666667 113.888889 L 443.333333 91.333333 C 449.555556 85.111111 449.555556 74.888889 443.333333 68.666667 C 437.111111 62.444444 426.888889 62.444444 420.666667 68.666667 Z M 420.666667 68.666667 " transform="matrix(0.0351562,0,0,0.0351562,0,0)"/>
                            </g>
                        </svg>
                        Share
                    </button>
                </div>
            </div>
        )
    }
}

interface State {
    games: Game[]
}

interface Props {
    accessToken: string
}

class GamesList extends Component<Props,State> {

    state: State = {
        games: []
    }

    componentDidMount() {
        axiosClient.request({
            method: 'GET',
            url: '/api/games/',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }).then((response) => {
            console.log(response.data)
            this.setState({games: response.data})
        }).catch((error) => {
            console.log(error)
        })
    }

    render () {
        return (
            <div className='container max-w-screen-lg flex-grow flex flex-col mx-auto p-8'>
                <h1 className='text-3xl font-bold'>
                    Past Games
                </h1>
                <div className="mt-8">
                    {this.state.games.map((game) => 
                        <PastGame game={game}/>
                    )}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state : any) => {
    return {
        accessToken: state.userReducer.accessToken
    }
}

export default connect(mapStateToProps)(GamesList)