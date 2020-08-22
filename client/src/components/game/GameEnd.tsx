import React, {Component} from 'react'
import {Game as GameType, Tournament as TournamentType} from '../../interfaces'
import {BattleEntry} from '../components'
import {withRouter, RouteComponentProps} from 'react-router-dom'
import {axiosClient} from '../../tools/axiosClient'

type TParams = {
    id: string
}

interface GameEndProps extends RouteComponentProps<TParams> {
    game: GameType,
    tournament: TournamentType
}

interface GameEndState {

}

class GameEnd extends Component<GameEndProps, GameEndState> {

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
    
    render () {
        console.log(this.props)
        return (
            <div>
                Winner is 
                <BattleEntry
                    entry={this.props.game.winner!}
                />

                <div className="flex">
                    <button onClick={() => {navigator.clipboard.writeText(this.getClipboardText())}} className="w-32 bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-red-500 hover:border-red-600 hover:bg-red-500 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
                        <span className="mx-auto">Share</span>
                    </button>
                    <input id='clipboard' className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" value={`http://localhost:8003/tournaments/${this.props.match.params.id}/`}/>
                </div>
                <div>
                    <button onClick={this.restartGame} className="w-32 bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-blue-500 hover:border-blue-600 hover:bg-blue-500 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
                        <span className="mx-auto">Restart</span>
                    </button>
                </div>
                <div>
                    Show Bracket
                </div>
                <div>
                    Similar Tournaments
                </div>
                <div>
                    Leave Comment
                </div>
            </div>
        )
    }
}

export default withRouter(GameEnd)