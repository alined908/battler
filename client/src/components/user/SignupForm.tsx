import React, {Component} from 'react'
import {login} from '../../actions/user'
import {connect} from 'react-redux'

interface State {
    username: string
    password: string
    email: string
}

interface Props {
    login: (userData: State) => void
}

class SignupForm extends Component<Props, State>{

    state : State = {
        username: '',
        email: '',
        password: ''
    }

    submitLogin = () => {
        this.props.login({...this.state})
    }

    changeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({username: e.target.value})
    }

    changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({password: e.target.value})
    }

    render() {
        return(
            <div className='flex flex-grow items-center justify-center'>
                <div className="flex max-w-sm w-full">
                    <form className="bg-white shadow-lg rounded px-8 py-6 mb-4 w-full">
                        <div className="mb-4">
                            <label className="block font-bold mb-2">
                                Username
                            </label>
                            <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" onChange={this.changeUsername}/>
                        </div>
                        <div className="mb-4">
                            <label className="block font-bold mb-2">
                                Email
                            </label>
                            <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" onChange={this.changeUsername}/>
                        </div>
                        <div className="mb-6">
                            <label className="block font-bold mb-2">
                                Password
                            </label>
                            <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" onChange={this.changePassword}/>
                        </div>

                        <button onClick={this.submitLogin} className="mb-4 shadow bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button">
                            Sign Up
                        </button>
                        <button className="shadow bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button">
                            Continue with Twitch
                        </button>
 
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = () => {

}

const mapDispatchToProps = {
    login
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm)