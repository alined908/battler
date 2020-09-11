import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {User} from '../interfaces/User'

interface NavbarProps {
    user: User
    isAuthenticated: boolean
}

class Navbar extends Component<NavbarProps> {
    render () {
      return (
        <div className="h-auto border-b shadow-sm bg-white w-full text-gray-700 bg-white">
            <div className="flex max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
                <div className="flex flex-row items-center justify-between p-3">
                    <Link to="/" className="text-xl font-bold text-gray-900 rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline">
                        Rater
                    </Link>
                    <button className="rounded-lg md:hidden focus:outline-none focus:shadow-outline">
                        Mobile
                    </button>
                </div>
                {!this.props.isAuthenticated &&
                    <div className="flex">
                        <nav className="flex-col hidden pb-4 md:pb-0 md:flex md:justify-end md:flex-row">
                            <Link to='/login' className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                                Login
                            </Link>
                        </nav>
                        <nav className="flex-col hidden pb-4 md:pb-0 md:flex md:justify-end md:flex-row">
                            <Link to='/signup' className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                                Signup
                            </Link>
                        </nav>
                    </div>
                }
                {this.props.isAuthenticated &&
                    <div className='flex'>
                        <nav className="flex-col hidden pb-4 md:pb-0 md:flex md:justify-end md:flex-row">
                            <Link to='/mytournaments' className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                                My Tournaments
                            </Link>
                        </nav>
                        <nav className="flex-col hidden pb-4 md:pb-0 md:flex md:justify-end md:flex-row">
                            <Link to='/games' className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                                My Games
                            </Link>
                        </nav>
                        <nav className="flex-col hidden pb-4 md:pb-0 md:flex md:justify-end md:flex-row">
                            <Link to='/logout' className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                                Logout
                            </Link>
                        </nav>
                    </div>
                    
                }
            </div>
        </div>
      )
    }
  }

export default Navbar