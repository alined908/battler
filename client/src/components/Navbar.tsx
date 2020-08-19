import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class Navbar extends Component {
    render () {
      return (
        <div className="h-auto border-b shadow-sm">
            <div className="bg-white">
                <div className="w-full text-gray-700 bg-white">
                    <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
                        <div className="flex flex-row items-center justify-between p-4">
                            <Link to="/" className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline">
                                Rater
                            </Link>
                            <button className="rounded-lg md:hidden focus:outline-none focus:shadow-outline">
                                Mobile
                            </button>
                            </div>
                            <nav className="flex-col flex-grow hidden pb-4 md:pb-0 md:flex md:justify-end md:flex-row">
                                <Link to='/tournaments' className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                                    Tournaments
                                </Link>
                                <Link to='/tournaments' className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                                    Something
                                </Link>
                            </nav>
                    </div>
                </div>
            </div>
        </div>
      )
    }
  }

export default Navbar