import React, {Component} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import {Home, Navbar, Tournaments, Tournament, Game} from '../components'

class RouterWrapper extends Component {

    render () {
        return (
            <Router>
                <Navbar/>
                <Switch>
                    <Route path='/' exact component={Home}/>
                    <Route path='/tournaments/:id/game' component={Game}/>
                    <Route path='/tournaments/:id' component={Tournament}/>
                    <Route path='/tournaments' component={Tournaments}/>
                </Switch>
            </Router>
        )
    }
    
}

export default RouterWrapper