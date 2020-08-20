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
            <div className="flex justify-center flex-col py-10 px-5 h-full bg-gray-100 max-w-screen-lg mx-auto">
                <div className="container rounded bg-white mx-auto">
                    {/* <img className="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains"/> */}
                    <div className="px-6 py-4">
                        <div className="mb-2 flex justify-between">
                            <span className="text-2xl font-bold ">
                                {this.state.tournament.title}
                            </span>
                            <button onClick={this.playGame} className="bg-green-400 hover:bg-green-600 text-white font-semibold py-2 px-5 shadow rounded">
                                Play
                            </button>
                        </div>
                        <p className="text-gray-700 text-base">
                            {this.state.tournament.description}
                        </p>
                        
                    </div>
                    <div className="px-4 py-4">
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#Tag1</span>
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#Tag2</span>
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">#Tag3</span>
                    </div>
                </div>
                
                <TournamentEntries
                    tournament={this.state.tournament}
                />
            </div>
        )
    }
}

export default Tournament