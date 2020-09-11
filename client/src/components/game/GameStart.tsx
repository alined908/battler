import React, {Component} from 'react'
import {axiosClient} from '../../tools/axiosClient'
import {Game as GameType, Tournament as TournamentType} from '../../interfaces'
import {Dialog, DialogTitle, DialogContent, DialogActions} from '@material-ui/core'

enum battleSizes {
    TWO = 2,
    THREE = 3,
    FOUR = 4
}

const keys = Object.keys(battleSizes).filter(k => typeof battleSizes[k as any] === "number");
const battleSizesList = keys.map(k => battleSizes[k as any]);

interface GameStartProps {
    tournament: TournamentType,
    closeGameStart: () => void,
    startNewGame: (game: GameType) => void
}

interface GameStartState {
    bracketSize: number | null
    battleSize: number
}

function generateBracketSizes (battleSize: number, tournamentSize: number) {
    let bracketSizes = []

    for (let i = battleSize; i <= tournamentSize; i = i * battleSize ){
        bracketSizes.push(i)
    }

    return bracketSizes
}

class GameStart extends Component<GameStartProps, GameStartState> {
    state: GameStartState = {
        bracketSize: null,
        battleSize: battleSizes.TWO
    }

    createGame = () => {
        axiosClient.request({
            url:  `api/tournaments/${this.props.tournament.url}/game/`,
            method: 'POST',
            data: {
                bracket_size: this.state.bracketSize,
                battle_size: this.state.battleSize
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }).then((response) => {
            console.log(response.data)
            this.props.startNewGame(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    handleBracketChange = (event : React.ChangeEvent<HTMLSelectElement> ) => {
        this.setState({bracketSize: parseInt(event.currentTarget.value)})
    }

    handleBattleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({battleSize: parseInt(event.currentTarget.value)})
    }

    render() {

        return (
            <Dialog open={true} onClose={this.props.closeGameStart} maxWidth="xs" fullWidth={true}>
                <DialogTitle>
                    Start a Game
                </DialogTitle>
                <DialogContent>
                    <label className="block text-xs font-bold mb-2" htmlFor="battle_size">
                        # of Entries Per Battle
                    </label>
                    <div className="inline-block relative w-full">
                        <select id='battle_size' onChange={this.handleBattleSizeChange} value={this.state.battleSize} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            {
                                battleSizesList.filter(size => parseInt(size) <= this.props.tournament.entries.length && parseInt(size) > 1).map((size) => 
                                    <option key={size} value={size.toString()}>{size}</option>
                                )
                            }
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                    <label className="block text-xs font-bold mb-2" htmlFor="bracket_size">
                        # of Entries
                    </label>
                    <div className="inline-block relative w-full">
                        <select id='bracket_size' onChange={this.handleBracketChange} value={this.state.bracketSize || ""} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            <option value=""></option>
                            {
                                generateBracketSizes(this.state.battleSize, this.props.tournament.entries.length).map((size) => 
                                    <option key={size} value={size.toString()}>{size}</option>
                                )
                            }
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <button onClick={this.props.closeGameStart} style={{maxHeight: 38}} className="flex items-center bg-white hover:bg-gray-100 text-red-500 text-sm font-semibold py-2 px-3 border rounded">
                        Back
                    </button>
                    <button onClick={this.createGame} style={{maxHeight: 38}} className="flex items-center bg-white hover:bg-gray-100 text-green-500 text-sm font-semibold py-2 px-3 border rounded">
                        <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" version="1.1">
                            <g id="surface1">
                                <path style={{fill:"#48bb78",strokeWidth:"32",strokeLinecap:"butt",strokeLinejoin:"miter",stroke: "-moz-initialrgb(0%,0%,0%)",strokeOpacity: 1,strokeMiterlimit:10}} d="M 112 111 L 112 401 C 112 418.444444 129 429.555556 143 421.111111 L 390.888889 272.777778 C 403 265.555556 403 246.444444 390.888889 239.222222 L 143 90.888889 C 129 82.444444 112 93.555556 112 111 Z M 112 111 " transform="matrix(0.0351562,0,0,0.0351562,0,0)"/>
                            </g>
                        </svg>
                        Play
                    </button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default GameStart
