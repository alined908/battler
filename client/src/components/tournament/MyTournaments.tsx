import React, {Component} from 'react'
import {axiosClient} from '../../tools/axiosClient'
import {connect} from 'react-redux'
import {User, Tournament} from '../../interfaces'
import {TournamentCard} from '../components'

interface Props {
    user: User
}

interface State {
    tournaments: Tournament[]
}

class MyTournaments extends Component<Props> {
    state: State = {
        tournaments: []
    }

    componentDidMount() {
        axiosClient.request({
            method: 'GET',
            url: `/api/users/${this.props.user.username}/tournaments/`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }).then((response) => {
            console.log(response.data)
            this.setState({tournaments: response.data})
        }).catch((error) => {
            console.log(error)
        })
    }

    render() {
        return (
            <div className="flex">
                {this.state.tournaments.map((tournament) => 
                    <TournamentCard tournament={tournament}/>
                )}
            </div>
        )
    }
}

const mapStateToProps = (state : any) => {
    return {
        user: state.userReducer.user
    }
}

export default connect(mapStateToProps)(MyTournaments)