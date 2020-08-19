import React, {Component} from 'react'
import {Dialog} from '@material-ui/core'
import {TournamentEntities} from '../components'
import {Tournament as TournamentType, TournamentEntry as TournamentEntryType} from '../../interfaces'
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
            <div>
                Loading
            </div>
            :
            <div className="p-10 h-full bg-gray-100">
                <div className="max-w-sm rounded border bg-white">
                    {/* <img className="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains"/> */}
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">{this.state.tournament.title}</div>
                        <p className="text-gray-700 text-base">
                            {this.state.tournament.description}
                        </p>
                    </div>
                    <div className="px-6 py-4">
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#Tag1</span>
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#Tag2</span>
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">#Tag3</span>
                    </div>
                </div>

                <button onClick={this.playGame} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                    Play
                </button>
                
                <TournamentEntities 
                    tournament={this.state.tournament}
                />
            </div>
        )
    }
}

export default Tournament