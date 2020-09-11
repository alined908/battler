import React, {Component} from 'react'
import {axiosClient} from '../../tools/axiosClient'
import * as types from '../../constants/user'
import {connect} from 'react-redux'
import {RouteComponentProps} from 'react-router-dom'


interface Props extends RouteComponentProps{
    setUser: (action: {}) => void
}

class TwitchCallback extends Component<Props> {

    componentDidMount() : void{

        const params = new URLSearchParams(window.location.hash.substring(1))
        const paramsJSON = Object.fromEntries(params)
        console.log(JSON.stringify(paramsJSON))

        axiosClient.request({
            method: 'POST',
            url: 'api/auth/twitch/',
            data: paramsJSON
        }).then((response) => {
            console.log(response.data)
            localStorage.setItem('accessToken', response.data)
            const action = {
                type: types.SET_USER,
                payload: response.data
            }
            this.props.setUser(action)
            this.props.history.push('/')
        }).catch((error) => {
            console.log(error)
        })
    }

    render(){
        return (
            <></>
        )
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        setUser: (action: {}) => dispatch(action)
    }
}

export default connect(null, mapDispatchToProps)(TwitchCallback)