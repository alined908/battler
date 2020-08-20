import React, {Component} from 'react'
import {TournamentEntry as TournamentEntryType} from '../../interfaces'

interface TournamentEntryState {
    entry: TournamentEntryType,
    titleField: string,
    isEditing: boolean
}

interface TournamentEntryProps {
    entry: TournamentEntryType,
    handleDelete: () => void,
    handleEdit: (entry: TournamentEntryType, title: string) => void
}

class TournamentEntry extends Component<TournamentEntryProps> {

    state : TournamentEntryState = {
        entry: this.props.entry,
        titleField: this.props.entry.title,
        isEditing: false
    }

    toggleEdit = () => {
        this.setState({isEditing: !this.state.isEditing})
    }

    onSubmit = () => {
        this.setState({isEditing: false}, () => this.props.handleEdit(this.state.entry, this.state.titleField))
    }

    editField = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({titleField: event.target.value})
    }

    render() {
        const entry = this.props.entry

        return (
            <div className="shadow-lg m-6" style={{minWidth: '14rem', minHeight: '14rem'}}>
                <div className='rounded overflow-hidden'>
                    <img className="w-full object-cover h-56" src={entry.photo} alt={entry.title}/>
                    <div className="px-3 py-4 overflow-hidden bg-white text-sm">
                        
                        {this.state.isEditing ?
                            <>
                                <div className="md:w-2/3">
                                    <input onChange={this.editField} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" value={this.state.titleField}/>
                                </div>
                                <button onClick={this.toggleEdit} className="bg-red-600 hover:bg-red-700 text-sm text-white font-semibold py-2 px-4 shadow rounded">
                                    Close
                                </button>
                                <button onClick={this.onSubmit} className="bg-blue-600 hover:bg-blue-700 text-sm text-white font-semibold py-2 px-4 shadow rounded">
                                    Submit
                                </button>
                            </>
                            :
                            <>
                                {entry.title}
                                
                                <button onClick={this.props.handleDelete} className="bg-red-600 hover:bg-red-700 text-sm text-white font-semibold py-2 px-4 shadow rounded">
                                    Delete
                                </button>
                                <button onClick={this.toggleEdit} className="bg-blue-600 hover:bg-blue-700 text-sm text-white font-semibold py-2 px-4 shadow rounded">
                                    Edit
                                </button>
                            </>
                        }
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default TournamentEntry