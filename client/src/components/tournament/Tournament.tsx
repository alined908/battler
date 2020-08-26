import React, {Component} from 'react'
import {TournamentEntries, TournamentEditForm} from '../components'
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
    editForm: boolean
}

class Tournament extends Component<TournamentProps, TournamentState> {

    state : TournamentState = {
        tournament: null,
        isLoading: true,
        editForm: false
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

    handleDelete = () => {
        if (window.confirm("Are you sure you want to delete?")){
            axiosClient.request({
                url: `api/tournaments/${this.props.match.params.id}/`,
                method: 'DELETE',
            }).then((response) => {
                this.props.history.push('/tournaments')
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    updateTournament = (tournament: TournamentType) => {
        this.setState({tournament})
    }

    toggleEditForm = () => {
        this.setState({editForm: !this.state.editForm})
    }

    playGame = () => {
        this.props.history.push(`/tournaments/${this.props.match.params.id}/game`)
    }

    render() {
        return (
            (this.state.tournament === null) ? 
            <div className="fixed -translate-y-1/2 -translate-x-1/2" style={{top: '50%', left:'50%'}}>
                <CircularProgress/>
            </div>
            :
            <div className="flex justify-center flex-col py-10 px-5 h-full bg-gray-100 max-w-screen-lg mx-auto w-full" >
                <div className="container rounded mx-auto">
                    <div className="py-4">
                        <div className="flex">
                            <div className="rounded overflow-hidden shadow-lg w-48 h-48">
                                <img src={this.state.tournament.avatar} className="w-48 object-cover h-48"/>
                            </div>
                            <div className='flex justify-between flex-grow pl-6'>
                                <div className="text-4xl font-bold ">
                                    {this.state.tournament.title}
                                    <div className="text-xs">
                                        {this.state.tournament.tags.map((tag) => 
                                            <span className="inline-block bg-white bg-gray-200 rounded-full px-3 py-1 font-semibold mr-2">
                                                #{tag}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 text-sm mt-4">
                                        {this.state.tournament.description}
                                    </p>
                                </div>
                                <div className="flex items-start pt-3">
                                    <button onClick={this.handleDelete} className="mr-2 flex items-center bg-white hover:bg-gray-100 text-red-500 text-sm font-semibold py-2 px-3 shadow rounded ml-4">
                                        
                                        <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" version="1.1">
                                            <g id="surface1">
                                                <path style={{fill:"#fff",strokeWidth:"32",strokeLinecap:"round",strokeLinejoin:"round",stroke: "#f56565",strokeOpacity: 1,strokeMiterlimit:4}} d="M 112 112 L 132 432 C 133 450.444444 146.444444 464 164 464 L 348 464 C 365.666667 464 378.888889 450.444444 380 432 L 400 112 " transform="matrix(0.0351562,0,0,0.0351562,0,0)"/>
                                                <path style={{fill:"#fff",strokeWidth:"32",strokeLinecap:"round",strokeLinejoin:"miter",stroke: "#f56565",strokeOpacity: 1,strokeMiterlimit:10}} d="M 80 112 L 432 112 " transform="matrix(0.0351562,0,0,0.0351562,0,0)"/>
                                                <path style={{fill:"#f56565",strokeWidth:"32",strokeLinecap:"round",strokeLinejoin:"round",stroke: "#e3e3",strokeOpacity: 1,strokeMiterlimit:4}}d="M 192 112 L 192 72 C 192 65.666667 194.555556 59.555556 199 55 C 203.555556 50.555556 209.666667 48 216 48 L 296 48 C 302.333333 48 308.444444 50.555556 313 55 C 317.444444 59.555556 320 65.666667 320 72 L 320 112 " transform="matrix(0.0351562,0,0,0.0351562,0,0)"/>
                                            </g>
                                        </svg>
                                    
                                        Delete
                                    </button>
                                    <button onClick={this.toggleEditForm} className="mr-2 flex items-center bg-white hover:bg-gray-100 text-blue-500 text-sm font-semibold py-2 px-3 shadow rounded">
                                        <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" version="1.1">
                                            <g id="surface1">
                                                <path style={{fill:"#4299e1",strokeWidth:"32",strokeLinecap:"round",strokeLinejoin:"round",stroke: "-moz-initialrgb(0%,0%,0%)",strokeOpacity: 1,strokeMiterlimit:4}} d="M 364.111111 125.222222 L 87 403 L 64 448 L 109 425 L 386.777778 147.888889 Z M 364.111111 125.222222 " transform="matrix(0.0351562,0,0,0.0351562,0,0)"/>
                                                <path style={{fill:"#4299e1",strokeWidth:"32",strokeLinecap:"round",strokeLinejoin:"round",stroke: "-moz-initialrgb(0%,0%,0%)",strokeOpacity: 1,strokeMiterlimit:4}} d="M 420.666667 68.666667 L 398.111111 91.333333 L 420.666667 113.888889 L 443.333333 91.333333 C 449.555556 85.111111 449.555556 74.888889 443.333333 68.666667 C 437.111111 62.444444 426.888889 62.444444 420.666667 68.666667 Z M 420.666667 68.666667 " transform="matrix(0.0351562,0,0,0.0351562,0,0)"/>
                                            </g>
                                        </svg>
                                        Edit
                                    </button>
                                    <button onClick={this.playGame} style={{maxHeight: 38}} className="flex items-center bg-white hover:bg-gray-100 text-green-500 text-sm font-semibold py-2 px-3 shadow rounded">
                                        <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" version="1.1">
                                            <g id="surface1">
                                                <path style={{fill:"#48bb78",strokeWidth:"32",strokeLinecap:"butt",strokeLinejoin:"miter",stroke: "-moz-initialrgb(0%,0%,0%)",strokeOpacity: 1,strokeMiterlimit:10}} d="M 112 111 L 112 401 C 112 418.444444 129 429.555556 143 421.111111 L 390.888889 272.777778 C 403 265.555556 403 246.444444 390.888889 239.222222 L 143 90.888889 C 129 82.444444 112 93.555556 112 111 Z M 112 111 " transform="matrix(0.0351562,0,0,0.0351562,0,0)"/>
                                            </g>
                                        </svg>
                                        Play
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="my-6"/>
                <TournamentEntries
                    tournament={this.state.tournament}
                    updateTournament={this.updateTournament}
                />
                <TournamentEditForm
                    toggleForm={this.toggleEditForm}
                    tournament={this.state.tournament}
                    updateTournament={this.updateTournament}
                    open={this.state.editForm}
                />
            </div>
        )
    }
}

export default Tournament