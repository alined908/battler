import React, {Component} from 'react'
import {Game as GameType, Tournament as TournamentType} from '../../interfaces'
import {GameBracket} from '../components'
import Confetti from 'react-confetti'
import {withRouter, RouteComponentProps} from 'react-router-dom'
import {axiosClient} from '../../tools/axiosClient'
import {Snackbar} from '@material-ui/core'

type TParams = {
    id: string
}

interface GameEndProps extends RouteComponentProps<TParams> {
    game: GameType,
    tournament: TournamentType
}

interface GameEndState {
    showBracket: boolean
    showCopied: boolean
}

class GameEnd extends Component<GameEndProps, GameEndState> {

    state : GameEndState = {
        showBracket: false,
        showCopied: false
    }

    getClipboardText = () => {
        const clipboard = document.getElementById("clipboard") as HTMLInputElement
        return clipboard.value
    }

    restartGame = () => {
        axiosClient.request({
            url:  `api/tournaments/${this.props.tournament.url}/game/`,
            method: 'PATCH',
            data: {
                is_endgame: true
            }
        }).then((response) => {
            console.log(response.data)
            this.props.history.push(`/tournaments/${this.props.match.params.id}/game`)
            this.props.history.go(0)
        }).catch((error) => {
            console.log(error)
        })
    }

    toggleBracket = () => {
        this.setState({showBracket: !this.state.showBracket})
    }

    toggleCopied = () => {
        this.setState({showCopied: !this.state.showCopied})
    }

    handleShare = () => {
        this.toggleCopied()
        const clipboardText = this.getClipboardText()
        navigator.clipboard.writeText(clipboardText)
    }
    
    render () {
   
        return (
            
            <div className="flex flex-grow justify-center flex-col py-16 px-5 h-full bg-gray-100 max-w-screen-lg mx-auto w-full">
                <div className="container rounded mx-auto -mt-32">
                    <div id='canvas' className="flex flex-col justify-center items-center">
                        <Confetti height={window.innerHeight - 63} numberOfPieces={300} gravity={0.05} recycle={false}/>
                        <div className="flex flex-col items-center">
                            <div className="text-4xl font-bold mb-8">
                                {this.props.game.winner!.title} wins!
                            </div>
                            <div className="rounded overflow-hidden shadow-md w-64 h-64">
                                <img src={this.props.game.winner!.photo} className="w-64 object-cover h-64"/>
                            </div>
                            <div className="flex justify-between mt-8">
                                <button onClick={this.handleShare} className="mr-2 flex items-center bg-white hover:bg-gray-100 text-blue-500 text-sm font-semibold py-2 px-3 shadow rounded ml-4">
                                    Share
                                </button>
                                <Snackbar
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right'
                                    }}
                                    message={
                                        <div>
                                            Link copied to clipboard
                                        </div>
                                    }
                                    open={this.state.showCopied}
                                    autoHideDuration={3000}
                                    onClose={this.toggleCopied}
                                />
                                <button onClick={this.toggleBracket} className="mr-2 flex items-center bg-white hover:bg-gray-100 text-blue-500 text-sm font-semibold py-2 px-3 shadow rounded ml-4">
                                    Bracket
                                </button>
                                
                                <input id='clipboard' className="hidden bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" value={`http://localhost:8003/tournaments/${this.props.match.params.id}/`}/>
                                <button onClick={this.restartGame} className="mr-2 flex items-center bg-white hover:bg-gray-100 text-green-500 text-sm font-semibold py-2 px-3 shadow rounded ml-4">
                                    Restart
                                </button>
                            </div>
                        </div>
                        {this.state.showBracket && <GameBracket closeBracket={this.toggleBracket} game={this.props.game}/>}
                    </div>
                </div>                
            </div>
        )
    }
}

export default withRouter(GameEnd)