import React, {Component} from 'react'
import {Game as GameType} from '../../interfaces'
import GameWebSocket from '../../tools/GameWebSocket'
import Grow from '@material-ui/core/Grow';
import { sum } from 'lodash'
import FlipMove from 'react-flip-move';

interface ChartProps {
    game: GameType
    scores: number[]
}

interface ChartState {
}

class GameChart extends Component<ChartProps, ChartState>{

    determinePercentage = (i : number, scores: number[]) => {
        const result = this.props.scores[i]/sum(scores)
        if (isNaN(result)){
            return 0
        }

        return result * 100
    }

    sortWithIndexes = (scores: number[]) => {
        let newScores = []

        for (let i = 0; i < scores.length ; i++) {
            newScores[i] = [scores[i], i]
        }

        newScores.sort((a, b) => {
            return b[0] - a[0]
        })

        let sortedIndex = []
        for (let j = 0; j < newScores.length; j++ ) {
            sortedIndex.push(newScores[j][1])
        }
        return sortedIndex
    }

    render() {
        console.log(this.props.scores)
        const battle = this.props.game.battles[0]
        const sortedIndex = this.sortWithIndexes(this.props.scores)

        return (
            <div className='mt-4'>
                
                    <FlipMove>
                        {sortedIndex.map((i, index) => {
                            const entry = battle.entries[i]
                            return (
                                <Grow key={i} in={true} timeout={(index + 1) * 500}>
                                    <div className="flex items-center mb-4">
                                        <div className='rounded overflow-hidden w-12 h-12 shadow'>
                                            <img className="w-12 object-cover h-12" src={entry.photo} alt={entry.title}/>
                                        </div>
                                        <div className="ml-8 flex text-sm items-center">
                                            <span className="font-semibold text-sm">
                                                {this.props.scores[i]}
                                            </span>
                                            <span className="ml-1 text-gray-700 text-xs" style={{marginTop: '.125rem'}}>
                                                ({`${this.determinePercentage(i, this.props.scores)}%`})
                                            </span>
                                        </div>
                                    </div>
                                </Grow>
                            )
                        })}
                    </FlipMove>
            </div>
        )
    }
}

enum GameState {
    GAME_LOAD,
    GAME_START,
    GAME_IN_BATTLE,
    GAME_BETWEEN_BATTLE,
    GAME_END
} 

interface OverlayProps {
    game: GameType
    gameState: GameState
    visible: boolean
}

interface OverlayState {
    socket: GameWebSocket
    scores: number[]
    chat: any[]
}

class GameTwitchOverlay extends Component<OverlayProps, OverlayState> {

    state : OverlayState = {
        socket: new GameWebSocket(this.props.game),
        scores: new Array(this.props.game.battle_size).fill(0),
        chat: []
    }

    componentDidMount () : void {
        const gameSocket = this.state.socket
        gameSocket.addCallbacks(this.updateScores, this.updateChat)
        gameSocket.connect()
    }

    componentDidUpdate (prevProps: OverlayProps){
        if (this.props.gameState !== prevProps.gameState && this.props.gameState === GameState.GAME_BETWEEN_BATTLE){
            const newScores = this.state.socket.tracker.reset()
            this.setState({scores: newScores})
        }
    }

    componentWillUnmount () : void {
        if (this.state.socket) {
            this.state.socket.disconnect()
        }
    }

    updateScores = (scores : number[]) => {
        this.setState({scores})
    }

    updateChat = (message : {}) => {
        this.setState({chat: [...this.state.chat, message]})
    }

    render () {

        return (
            <div className={`${this.props.visible ? "": "hidden"} ml-4 mt-8`}>
                {this.props.gameState === GameState.GAME_IN_BATTLE && 
                    <>  
                        <div className="font-semibold text-sm">
                            Total votes - {sum(this.state.scores)}
                        </div>
                        <GameChart game={this.props.game} scores={this.state.scores}/>
                    </>
                }
            </div>
        )
    }
}

export default GameTwitchOverlay