import React, {Component} from 'react'
import {Tournament as TournamentType, TournamentEntry as TournamentEntryType} from '../../interfaces'
import {axiosClient} from '../../tools/axiosClient'
import {TournamentEntry} from '../components'
import Dropzone from 'react-dropzone';

enum EntriesDisplay {
    List,
    Grid
}

interface TournamentEntriesProps {
    tournament: TournamentType
    updateTournament: (tournament: TournamentType) => void
}

interface TournamentEntriesState {
    tournament: TournamentType
    showUpload: boolean,
    display: EntriesDisplay,
    files: File[]
}

class TournamentEntries extends Component<TournamentEntriesProps, TournamentEntriesState> {

    state : TournamentEntriesState = {
        tournament: this.props.tournament,
        showUpload: false,
        display: EntriesDisplay.List,
        files: []
    }

    submitEntries = () => {
        let data = new FormData();
    
        for (let i = 0; i < this.state.files.length; i++) {
            const image = this.state.files[i]
            data.append('files', image, image.name)
        }
       
        axiosClient.request({
            url: `api/tournaments/${this.props.tournament.url}/entry/`,
            method: 'POST',
            data,
            headers: {
                'content-type': 'multipart/form-data'
            }
        }).then((response) => {
            console.log(response.data)
            this.updateEntities(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    deleteEntry = (entry: TournamentEntryType) => {
        
        axiosClient.request({
            url: `api/tournaments/${this.props.tournament.url}/entry/${entry.id}/`,
            method: 'DELETE'
        }).then((response) => {
            console.log(response.data)
            this.setState({
                tournament: {
                    ...this.state.tournament, 
                    entries: this.state.tournament.entries.filter((ele) => ele.id !== entry.id)
                }
            })
        }).catch((error) => {
            console.log(error)
        })
    }

    editEntry = (entry: TournamentEntryType, title: string) => {
        axiosClient.request({
            url: `api/tournaments/${this.props.tournament.url}/entry/${entry.id}/`,
            method: 'PATCH',
            data: {
                title
            }
        }).then((response) => {
            console.log(response.data)
            this.setState({
                tournament: {
                    ...this.state.tournament, 
                    entries: this.state.tournament.entries.map((ele) => ele.id === entry.id ? response.data : ele)
                }
            })
        }).catch((error) => {
            console.log(error)
        })
    }

    onDrop = (files: any) => {
        console.log(files)
        this.setState({files}, () => this.submitEntries())
    };

    showDisplay = (display: EntriesDisplay) => {
        this.setState({display})
    }

    toggleUpload = () => {
        this.setState({showUpload: !this.state.showUpload})
    }

    promptUpload = () => {
        const hiddenButton = document.getElementById('hidden-input')
        hiddenButton?.click()
    }

    updateEntities = (entries: TournamentEntryType[]) => {
        const newTournament = {...this.state.tournament, entries: [...entries, ...this.state.tournament.entries]}
        this.setState({tournament: newTournament}, () => this.props.updateTournament(newTournament))
    }

    render() {
        return (
            <div className="py-2 w-full">
                <div className="flex container items-center justify-between w-full py-3 rounded">
                    <h1 className="font-bold">Entries</h1>
                    <div className='flex item-center'>
                        <div className="bg-gray-200 text-sm text-gray-500 leading-none border-2 border-gray-200 rounded inline-flex mr-10">
                            <button onClick={() => this.showDisplay(EntriesDisplay.Grid)} className={`inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 px-4 py-2 ${this.state.display === EntriesDisplay.Grid && 'active'}`} id="grid">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-current w-4 h-4 mr-2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                <span className="font-semibold">Grid</span>
                            </button>
                            <button onClick={() => this.showDisplay(EntriesDisplay.List)} className={`inline-flex items-center transition-colors duration-300 ease-in focus:outline-none text-semibold hover:text-blue-400 focus:text-blue-400 px-4 py-2 ${this.state.display === EntriesDisplay.List && 'active'}`} id="list">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-current w-4 h-4 mr-2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                                <span className="font-semibold">List</span>
                            </button>
                        </div>
                        <button onClick={this.toggleUpload} className="flex items-center bg-white hover:bg-gray-100 text-gray-800 text-sm font-semibold py-2 px-3 shadow rounded">
                            <svg fill="#000" height="18" className="mr-1" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                            </svg>
                            Upload
                        </button>
                    </div>
                    
                </div>
                {this.state.showUpload && 
                    <div className="flex items-center flex-col my-4">
                        <div className="w-full sm:py-8">
                            <Dropzone onDrop={this.onDrop}>
                                {({getRootProps, getInputProps}) => (
                                    <div {...getRootProps({className: 'dropzone'})} className="container mx-auto">
                                        <div aria-label="File Upload Modal" className="relative flex flex-col rounded-md" >
                                            <div className="h-full overflow-auto w-full h-full flex flex-col">
                                                <div className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                                                    <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                                                        <span>Drag and drop</span>&nbsp;<span>images or click to upload.</span>
                                                    </p>
                                                    <img className="mx-auto w-32" src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" alt="no data" />
                                                    <input {...getInputProps()}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Dropzone>
                            
                        </div>
                    </div>
                }
                {/* {this.state.image && 
                    <div>
                        <span>{this.state.image.name}</span>
                        <img src={this.state.imageURL}/>
                    </div>
                } */}
                <div className={this.state.display === EntriesDisplay.Grid ? "grid w-full xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3": " w-full my-4"}>
                    {this.state.display === EntriesDisplay.Grid ?
                        this.state.tournament.entries.map((entry) => 
                            <TournamentEntry
                                key={entry.id}
                                display={this.state.display}
                                entry={entry}
                                handleDelete={() => this.deleteEntry(entry)}
                                handleEdit={this.editEntry}
                            />
                        )
                    :
                    <div className="px-3 py-4 flex justify-center">
                        <table className="w-full text-md bg-white shadow-md rounded mb-4">
                            <tbody>
                                <tr className="border-b">
                                    <th className="text-left py-4 px-5">Media</th>
                                    <th className="text-left py-4 px-5">Name</th>
                                    <th className="text-left py-4 px-5">Date</th>
                                    <th className="text-left py-4 px-5">Actions</th>
                                </tr>
                                {this.state.tournament.entries.map((entry) => 
                                    <TournamentEntry
                                        key={entry.id}
                                        display={this.state.display}
                                        entry={entry}
                                        handleDelete={() => this.deleteEntry(entry)}
                                        handleEdit={this.editEntry}
                                    />
                                )}
                            </tbody>
                        </table>
                    </div>
                    }
                </div>
            </div>
        )
    }
}

export default TournamentEntries