import React, {Component} from 'react'
import {Dialog, DialogTitle, DialogContent, DialogActions} from '@material-ui/core'
import {Game as GameType, Round as RoundType, Battle as BattleType} from '../../interfaces'

interface BattleProps{
    battle: BattleType
}

class Battle extends Component<BattleProps> {
    render() {
        return (
            <div className="battle my-4">
                {this.props.battle.entries.map((entry) => 
                    <div className="rounded overflow-hidden shadow-md w-16 h-16">
                        <img src={entry.photo} className="w-16 object-cover h-16"/>
                    </div>
                )}
            </div>
        )
    }
}

interface RoundProps {
    round: RoundType
    index: number
}

class Round extends Component<RoundProps> {
    render() {
        return (
            <div id={`round-${this.props.index}`} className="round mx-16 flex flex-col justify-around">
                {this.props.round.battles.map((battle) =>
                    <Battle battle={battle} key={battle.id}/>
                )}
            </div>
        )
    }
}

interface ConnectorProps {
    round: RoundType
    index: number
}

class Connector extends Component<ConnectorProps>{
    componentDidMount(){
        const round = document.getElementById(`round-${this.props.index}`)
        console.log(round)
    }

    render(){
        return (
            <div className="connector flex h-full"></div>
        )
    }
}

interface BracketProps {
    bracket: RoundType[]
}

class Bracket extends Component<BracketProps>{

    render () {
        return (
            <div className="bracket container flex">
                {this.props.bracket.map((round, i) => 
                    <>
                        <Round index={i} round={round} key={round.id}/>
                        <Connector index={i} round={round}/>
                    </>
                )}
            </div>
        )
    }
}

interface GameBracketProps {
    closeBracket: () => void
    game: GameType
}

class GameBracket extends Component<GameBracketProps> {

    render() {
        return (
            <Dialog open={true} onClose={this.props.closeBracket} maxWidth="lg">
                <DialogTitle>
                    Bracket
                </DialogTitle>
                <DialogContent dividers>
                    <Bracket bracket={this.props.game.bracket!}/>
                </DialogContent>
                <DialogActions>
                    <button onClick={this.props.closeBracket} className="bg-white hover:bg-gray-100 text-xs text-red-500 border font-semibold py-2 px-3 rounded">
                        Close
                    </button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default GameBracket