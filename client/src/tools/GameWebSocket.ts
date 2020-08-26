
import GameTracker from './GameTracker'
import {Game as GameType} from '../interfaces/index'

class GameWebSocket {
    socket: WebSocket | null
    tracker: GameTracker
    updateChat!: (data: {}) => void
    updateScores!: (data: number[]) => void
    
    constructor(game: GameType) {
        this.tracker = new GameTracker(game)
        this.socket = null
    }

    connect = () => {
        
        const fullPath = this.handleURL('wss://irc-ws.chat.twitch.tv:443')
        this.socket = new WebSocket(fullPath)

        this.socket.onmessage = (e) => {
            this.receiveServerMessage(e.data)
        }

        this.socket.onopen = (e) => {
            console.log("WebSocket open");
            this.socket?.send(`PASS ${process.env.REACT_APP_TWITCH_OAUTH}`)
            this.socket?.send('NICK raterBot')
            this.socket?.send('JOIN #alinedow')
        }

        this.socket.onerror = (e: Event) => {
            console.log(e);
        } 

        this.socket.onclose = (e) => {
            console.log(e)
        }
    }

    disconnect = () => {
        if (this.socket) {
            this.socket.onclose = () => {}
            this.socket.close()
        }
    }

    receiveServerMessage = (data: any) => {
        console.log(data)

        if (data === 'PING :tmi.twitch.tv'){
            this.socket?.send('PONG :tmi.twitch.tv')
        }

        const regex = ':(.*)\!.*@.*\.tmi\.twitch\.tv PRIVMSG #(.*) :(.*)'
        let match = data.match(regex)
        if (match) {
            const message = {
                username: match[1],
                message: match[3]
            }
            this.updateChat(message)
            this.tracker.updateScore(message, this.updateScores)
        }
    }

    handleURL = (path: string) => {
        const baseURL = process.env.REACT_APP_DEV_BASE_URL
        let url = new URL(path, baseURL);
        url.protocol =
        url.protocol === "http:"
            ? url.protocol.replace("http", "ws")
            : url.protocol.replace("https", "wss");
        return url.href
    }
    
    addCallbacks = (updateScores : (data: any) => void, updateChat : (data: any) => void) => {
        this.updateScores = updateScores
        this.updateChat = updateChat
    }
}

export default GameWebSocket