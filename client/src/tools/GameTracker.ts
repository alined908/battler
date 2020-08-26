
import {Game as GameType} from '../interfaces'

interface chatMessage {
    username: string
    message: string
}

type scoreCount = {[key: number]: number}

class GameTracker {

    scoreCount: scoreCount
    responders: any
    respondedTracker: {[key:string]: number}
    game: GameType

    constructor(game: GameType) {
        
        this.game = game
        this.scoreCount = this.initializeScoreCount()
        this.responders = new Set()
        this.respondedTracker = {}
    }

    initializeScoreCount = () => {
        let scoreCount : scoreCount = {}

        for (let i = 0; i < this.game.battle_size; i++) {
            scoreCount[i+1] = 0
        }

        return scoreCount
    }

    getScores = () => {
        let scores : number[] = Array().fill(0)

        for (let key in this.scoreCount){
            scores[parseInt(key) - 1] = this.scoreCount[key]
        }

        return scores
    }

    reset = () => {
        this.scoreCount = this.initializeScoreCount()
        this.responders = new Set()
        this.respondedTracker = {}
        return this.getScores()
    }

    isValidScore = (message: any) => {
        if (isNaN(message)){
            return false
        }

        return parseInt(message) in this.scoreCount
    } 

    updateScore = (data : chatMessage, callback: (scores: number[]) => void) => {
        console.log(data)
        if (!this.isValidScore(data.message)){
            return false
        }

        const score = parseInt(data.message)
        console.log(this.responders)
        console.log(this.respondedTracker)
        if (this.responders.has(data.username) && this.respondedTracker[data.username] != score){
            const oldScore = this.respondedTracker[data.username]
            this.scoreCount[oldScore] -= 1
        }

       
        if (this.respondedTracker[data.username] !== score) {
            this.scoreCount[score] += 1
        }
        this.respondedTracker[data.username] = score
        this.responders.add(data.username)
        
        const scores = this.getScores()
        callback(scores)
    }
}

export default GameTracker