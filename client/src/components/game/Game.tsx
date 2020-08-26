import React, {Component} from 'react'
import {axiosClient} from '../../tools/axiosClient'
import {Battle, GameStart, GameEnd, GameTwitchOverlay as TwitchOverlay} from '../components'
import {Game as GameType, Tournament as TournamentType} from '../../interfaces'
import {RouteComponentProps} from 'react-router-dom'
import {CircularProgress} from '@material-ui/core'
import Slide from '@material-ui/core/Slide';

enum GameState {
    GAME_LOAD,
    GAME_START,
    GAME_IN_BATTLE,
    GAME_BETWEEN_BATTLE,
    GAME_END
} 

type TParams = {
    id: string
}

interface GameProps extends RouteComponentProps<TParams>{}

interface State {
    game: GameType | null
    gameState: GameState
    tournament: TournamentType | null
    visibleOverlay: boolean
}

class Game extends Component<GameProps, State> {

    state : State = {
        game: null,
        tournament: null,
        gameState: GameState.GAME_LOAD,
        visibleOverlay: true
    }

    componentDidMount () : void {
        setTimeout(() => console.log('hello'), 20000)

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
                game: response.data,
                gameState: response.data.winner ? GameState.GAME_END : GameState.GAME_IN_BATTLE
            })
        }).catch((error) => {
            this.setState({
                gameState: GameState.GAME_START
            })
        })
    }

    closeGameStart = () => {
        this.props.history.push(`/tournaments/${this.props.match.params.id}/`)
    }

    startNewGame = (game: GameType) => {
        this.setState({game, gameState: GameState.GAME_IN_BATTLE})
    }

    advanceNextBattle = () => {
        this.setState({gameState: GameState.GAME_BETWEEN_BATTLE})
        
        if (this.state.game!.battles.length > 1) {
            this.setState({
                game: {
                    ...this.state.game!, 
                    battles: [...this.state.game!.battles.slice(1)]
                },
                gameState: GameState.GAME_IN_BATTLE
            })
        } else {
            axiosClient.request({
                url: `api/tournaments/${this.props.match.params.id}/game/`,
                method: 'GET'
            }).then((response) => {
                console.log(response.data)
                this.setState({
                    game: response.data,
                    gameState: response.data.winner ? GameState.GAME_END : GameState.GAME_IN_BATTLE
                })
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    handleVisibility = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({visibleOverlay: !this.state.visibleOverlay})
    }

    getGameComponent = () => {
        switch (this.state.gameState){
            case (GameState.GAME_LOAD):
                return <div className="flex flex-grow items-center justify-center">
                </div>
            case (GameState.GAME_START):
                return <GameStart
                            tournament={this.state.tournament!}
                            closeGameStart={this.closeGameStart}
                            startNewGame={this.startNewGame}
                        />
            case (GameState.GAME_IN_BATTLE):
                return <Battle 
                            advanceNextBattle={this.advanceNextBattle}
                            battle={this.state.game!.battles[0]}
                            tournamentID={this.props.match.params.id}
                        />
                        
            case (GameState.GAME_BETWEEN_BATTLE):
                return <div className="flex flex-grow items-center justify-center">
                </div>
            case (GameState.GAME_END):
                return <GameEnd
                            tournament={this.state.tournament!}
                            game={this.state.game!}
                        />
        }
    }

    render () {
        const showOverlay = this.state.gameState === GameState.GAME_IN_BATTLE || this.state.gameState === GameState.GAME_BETWEEN_BATTLE

        return (
            <div className="relative flex flex-col flex-grow items-center">
                <div className="ml-4 flex mt-6 flex-col absolute left-0 w-56">
                    
                    {showOverlay &&
                        <>
                            <label className="inline-flex items-center my-3 ml-4 cursor-pointer">
                                <input onChange={this.handleVisibility} checked={this.state.visibleOverlay} type="checkbox" className="form-checkbox shadow"/>
                                <span className="ml-2 text-sm font-semibold">Show Chat Scores</span>
                            </label>
                            <TwitchOverlay
                                visible={this.state.visibleOverlay}
                                gameState={this.state.gameState}
                                game={this.state.game!}
                            />
                        </>
                    }
                </div>
                {this.getGameComponent()}
            </div>
        )
    }
}

export default Game