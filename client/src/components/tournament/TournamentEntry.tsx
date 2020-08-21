import React, {Component} from 'react'
import {TournamentEntry as TournamentEntryType} from '../../interfaces'

enum EntriesDisplay {
    List,
    Grid
}

interface TournamentEntryState {
    entry: TournamentEntryType,
    titleField: string,
    isEditing: boolean
}

interface TournamentEntryProps {
    entry: TournamentEntryType,
    display: EntriesDisplay,
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

        const actions = this.state.isEditing ?
            <>
                <button onClick={this.onSubmit} className="bg-white hover:bg-gray-100 text-xs text-blue-500 border font-semibold py-2 px-3 rounded mr-2">
                    Submit
                </button>
                <button onClick={this.toggleEdit} className="bg-white hover:bg-gray-100 text-xs text-red-500 border font-semibold py-2 px-3 rounded">
                    Close
                </button>
            </>
            :
            <>       
                <button onClick={this.toggleEdit} className="bg-white hover:bg-gray-100 text-xs text-blue-500 border font-semibold py-2 px-3 rounded mr-2">
                    Edit
                </button>         
                <button onClick={this.props.handleDelete} className="bg-white hover:bg-gray-100 text-xs text-red-500 border font-semibold py-2 px-3 rounded">
                    Delete
                </button>
            </>

        const titleInput = this.state.isEditing ? 
            <input onChange={this.editField} className="bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" value={this.state.titleField}/>
            :
            entry.title

        return (
            this.props.display === EntriesDisplay.Grid ?
            <div className="shadow-md m-6" style={{minWidth: '14rem', minHeight: '14rem'}}>
                <div className='rounded overflow-hidden'>
                    <img className="w-full object-cover h-56" src={entry.photo} alt={entry.title}/>
                    <div className="flex items-center justify-between px-3 py-3 overflow-hidden bg-white text-sm font-semibold">
                        {titleInput}
                        <div className='flex items-center'>
                            {actions}
                        </div>
                        
                    </div>
                </div>
            </div>
            :
            <tr className="border-b hover:bg-orange-100">
                <td className="p-3 px-4">
                    <div className="rounded overflow-hidden shadow-md w-24 h-24">
                        <img src={entry.photo} className="w-24 object-cover h-24"/>
                    </div>
                    
                </td>
                <td className="p-3 px-4 text-sm font-semibold">
                    {titleInput}
                </td>
                <td className="p-3 px-4 text-sm">
                    {entry.created_at}
                </td>
                
                <td className="p-3 px-4">
                    {actions}
                </td>
            </tr>
        )
    }
}

export default TournamentEntry