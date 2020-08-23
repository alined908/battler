import React, {Component} from 'react'
import {axiosClient} from '../../tools/axiosClient'
import {Battle, GameStart, GameEnd} from '../components'
import {Game as GameType, Tournament as TournamentType} from '../../interfaces'
import {RouteComponentProps} from 'react-router-dom'

type TParams = {
    id: string
}

interface GameProps extends RouteComponentProps<TParams>{}

interface GameState {
    game: GameType | null,
    promptGameStart: boolean,
    tournament: TournamentType | null
}

class Game extends Component<GameProps, GameState> {

    state : GameState = {
        game: null,
        tournament: null,
        promptGameStart: false
    }

    componentDidMount () : void {

        axiosClient.request({
            url: `api/tournaments/${this.props.match.params.id}/`,
            method: 'GET'
        }).then((response) => {
            console.log(response.data)
            this.setState({
                tournament: response.data
            })
        }).catch((error) => {
            this.props.history.push('/404')
        })

        this.getGameState()
    }

    getGameState = () => {
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
                promptGameStart: true
            })
        })
    }

    closeGameStart = () => {
        this.props.history.push(`/tournaments/${this.props.match.params.id}/`)
    }

    startNewGame = (game: GameType) => {
        this.setState({game, promptGameStart: false})
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

    render () {
        const inGame = !this.state.promptGameStart && this.state.game
        
        return (
            <div className="flex flex-col flex-grow items-center">
                {this.state.promptGameStart && this.state.tournament && 
                    <GameStart
                        tournament={this.state.tournament}
                        closeGameStart={this.closeGameStart}
                        startNewGame={this.startNewGame}
                    />
                }
                {inGame && this.state.game!.battles.length > 0 &&
                    <Battle 
                        advanceNextBattle={this.advanceNextBattle}
                        battle={this.state.game!.battles[0]}
                        tournamentID={this.props.match.params.id}
                    />
                }
                {inGame && this.state.game!.winner && 
                    <GameEnd
                        tournament={this.state.tournament!}
                        game={this.state.game!}
                    />
                }
            </div>
        )
    }
}

export default Game