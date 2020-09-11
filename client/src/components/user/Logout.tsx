import React, {Component} from 'react'
import {RouteComponentProps} from 'react-router-dom'

interface Props extends RouteComponentProps {
    logout: () => void
}

class Logout extends Component<Props> {

    componentDidMount () {
        this.props.logout()
        this.props.history.push('/tournaments')
    }

    render() {
        return (
            <></>
        )
    }
}  

export default Logout