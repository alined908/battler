import React, {Component} from "react";
import {
  Router,
  Switch,
  Route
} from "react-router-dom";
import {connect} from 'react-redux'
import {logout} from '../../actions/user'
import history from '../../tools/browserHistory';
import {Navbar, Tournaments, Tournament, Game, LoginForm, SignupForm, TwitchCallback, Logout, GamesList, MyTournaments} from '../components'
import {User} from '../../interfaces/User'

interface RouterProps {
    isAuthenticated: boolean
    user: User
    logout: () => void
}

class RouterWrapper extends Component<RouterProps> {

    render () {
        return (
            <Router history={history}>
                <Navbar user={this.props.user} isAuthenticated={this.props.isAuthenticated}/>
                <Switch>
                    <Route path='/' exact component={Tournaments}/>
                    <Route path='/login' exact component={LoginForm}/>
                    <Route path='/signup' exact component={SignupForm}/>
                    <Route path='/logout' exact render={(props) => (<Logout {...props} logout={this.props.logout}/>)}/>
                    <Route path='/twitch/callback/' component={TwitchCallback}/>
                    <Route path='/tournaments/:id/game' component={Game}/>
                    <Route path='/tournaments/:id' component={Tournament}/>
                    <Route path='/tournaments' component={Tournaments}/>
                    <Route path='/mytournaments' component={MyTournaments}/>
                    <Route path='/games' component={GamesList}/>
                </Switch>
            </Router>
        )
    }
    
}

const mapStateToProps = (state: any) => {
    return {
        isAuthenticated: state.userReducer.isAuthenticated,
        user: state.userReducer.user
    }
}

const mapDispatchToProps = {
    logout
}

export default connect(mapStateToProps, mapDispatchToProps)(RouterWrapper)