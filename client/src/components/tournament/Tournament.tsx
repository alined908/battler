import React, {Component} from 'react'
import {TournamentEntries} from '../components'
import {CircularProgress} from '@material-ui/core'
import {Tournament as TournamentType} from '../../interfaces'
import {axiosClient} from '../../tools/axiosClient'
import {RouteComponentProps} from 'react-router-dom'

type TParams = {
    id: string
}

interface TournamentProps extends RouteComponentProps<TParams> {

}

interface TournamentState {
    tournament: TournamentType | null,
    isLoading: boolean
    imageUpload: {
        image: string | null,
        imageURL: string | null | ArrayBuffer
    }
}

class Tournament extends Component<TournamentProps, TournamentState> {

    state : TournamentState = {
        tournament: null,
        isLoading: true,
        imageUpload: {
            image: null,
            imageURL: ''
        }
    }

    componentDidMount() : void {
        axiosClient.request({
            url: `api/tournaments/${this.props.match.params.id}/`,
            method: 'GET',
        }).then((response) => {
            console.log(response.data)
            this.setState({
                tournament: response.data,
                isLoading: false
            })
        }).catch((error) => {
            this.props.history.push('/404')
        })
    }

    playGame = () => {
        this.props.history.push(`/tournaments/${this.props.match.params.id}/game`)
    }

    render() {
        return (
            (this.state.tournament === null) ? 
            <div className="flex h-full w-full items-center justify-center">
                <CircularProgress/>
            </div>
            :
            <div className="flex justify-center flex-col py-10 px-5 h-full bg-gray-100 max-w-screen-lg mx-auto w-full" >
                <div className="container rounded mx-auto">
                    {/* <img className="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains"/> */}
                    <div className="py-4">
                        <div className="mb-2 flex justify-between">
                            <span className="text-2xl font-bold ">
                                {this.state.tournament.title}
                            </span>
                            <button onClick={this.playGame} className="flex items-center bg-white hover:bg-gray-100 text-green-500 text-sm font-semibold py-2 px-3 shadow rounded">
                                <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" version="1.1">
                                    <g id="surface1">
                                        <path style={{fill:"#48bb78",strokeWidth:"32",strokeLinecap:"butt",strokeLinejoin:"miter",stroke: "-moz-initialrgb(0%,0%,0%)",strokeOpacity: 1,strokeMiterlimit:10}} d="M 112 111 L 112 401 C 112 418.444444 129 429.555556 143 421.111111 L 390.888889 272.777778 C 403 265.555556 403 246.444444 390.888889 239.222222 L 143 90.888889 C 129 82.444444 112 93.555556 112 111 Z M 112 111 " transform="matrix(0.0351562,0,0,0.0351562,0,0)"/>
                                    </g>
                                </svg>
                                Play
                            </button>
                        </div>
                        <div className="text-xs">
                            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700 mr-2">#bts</span>
                            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700 mr-2">#yolo</span>
                            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700">#music</span>
                        </div>
                        <p className="text-gray-700 text-sm mt-8">
                            {this.state.tournament.description}
                        </p>
                        
                    </div>
                </div>
                <hr className="my-6"/>
                <TournamentEntries
                    tournament={this.state.tournament}
                />
            </div>
        )
    }
}

export default Tournament