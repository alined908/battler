import React, {Component} from 'react'
import {axiosClient} from '../../tools/axiosClient'
import {Battle} from '../components'
import {Game as GameType, Battle as BattleType} from '../../interfaces'
import {RouteComponentProps} from 'react-router-dom'
import {Dialog} from '@material-ui/core'

enum bracketSizes {
    ONE = 1,
    TWO = 2,
    FOUR = 4,
    EIGHT = 8,
    SIXTEEN = 16,
    THIRTYTWO = 32,
    SIXTYFOUR = 64
}

const keys = Object.keys(bracketSizes).filter(k => typeof bracketSizes[k as any] === "number");
const bracketSizesList = keys.map(k => bracketSizes[k as any]);
console.log(bracketSizesList)

type TParams = {
    id: string
}

interface GameProps extends RouteComponentProps<TParams>{

}

interface GameState {
    game: GameType | null,
    promptGame: boolean,
    bracketSize: number | null
}

class Game extends Component<GameProps, GameState> {

    state : GameState = {
        game: null,
        promptGame: false,
        bracketSize: null
    }

    componentDidMount () : void {
        axiosClient.request({
            url: `api/tournaments/${this.props.match.params.id}/game/`,
            method: 'GET'
        }).then((response) => {
            console.log(response.data)
            this.setState({
                game: response.data
            })
        }).catch((error) => {
            this.setState({
                promptGame: true
            })
        })
    }

    createGame = () => {
        axiosClient.request({
            url:  `api/tournaments/${this.props.match.params.id}/game/`,
            method: 'POST',
            data: {
                bracket_size: this.state.bracketSize
            }
        }).then((response) => {
            console.log(response.data)
            this.setState({
                game: response.data,
                promptGame: false
            })
        }).catch((error) => {
            console.log(error)
        })
    }

    advanceNextBattle = () => {
        if (this.state.game!.battles.length > 1) {
            this.setState({
                game: {
                    ...this.state.game!, 
                    battles: [...this.state.game!.battles.slice(1)]
                }
            })
        } else {
            axiosClient.request({
                url: `api/tournaments/${this.props.match.params.id}/game/`,
                method: 'GET'
            }).then((response) => {
                console.log(response.data)
                this.setState({
                    game: response.data
                })
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    closeGame = () => {
        this.props.history.push(`/tournaments/${this.props.match.params.id}/`)
    }

    handleBracketChange = (event : any) => {
        this.setState({bracketSize: event.target.value || null})
    }

    render () {
        return (
            <div className="h-full">
                {this.state.promptGame &&
                    <Dialog open={true} onClose={this.closeGame} maxWidth="xs" fullWidth={true}>
                        <div>
                            Start a Game
                        </div>
                        <div>
                            <div className="inline-block relative w-full">
                                <select onChange={this.handleBracketChange} value={this.state.bracketSize || ""} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                    <option value=""></option>
                                    {
                                        bracketSizesList.filter(size => parseInt(size) < this.state.game!.bracket_size).map((size) => 
                                            <option value={size.toString()}>{size}</option>
                                        )
                                    }
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className="bg-green-500 text-green-100 hover:bg-gray-400 font-bold py-1 px-3 rounded inline-flex items-center">
                                <span onClick={this.createGame}>Play</span>
                            </button>
                        </div>
                    </Dialog>
                }
                {!this.state.promptGame && this.state.game &&
                    <Battle 
                        advanceNextBattle={this.advanceNextBattle}
                        battle={this.state.game.battles[0]}
                        tournamentID={this.props.match.params.id}
                    />
                }
            </div>
        )
    }
}

export default Game