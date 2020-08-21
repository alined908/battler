import React, {Component} from 'react'
import {Tournament as TournamentType, TournamentEntry as TournamentEntryType} from '../../interfaces'
import {axiosClient} from '../../tools/axiosClient'
import {TournamentEntry} from '../components'
import Dropzone from 'react-dropzone';

enum EntriesDisplay {
    List,
    Grid
}

type imageObject = {
    tournament?: string,
    photo?: File
    title?: string
}

interface TournamentEntriesProps {
    tournament: TournamentType
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
        display: EntriesDisplay.Grid,
        files: []
    }

    submitEntries = () => {
        let data = new FormData();
    
        for (let i = 0; i < this.state.files.length; i++) {
            const image = this.state.files[i]
            data.append('files', image, image.name)
        }
        console.log(data)
        axiosClient.request({
            url: `api/tournaments/${this.props.tournament.id}/entry/`,
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
            url: `api/tournaments/${this.props.tournament.id}/entry/${entry.id}/`,
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
            url: `api/tournaments/${this.props.tournament.id}/entry/${entry.id}/`,
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
        this.setState({tournament: {...this.state.tournament, entries: [...entries, ...this.state.tournament.entries]}})
    }

    render() {
        return (
            <div className="py-2 w-full">
                <div className="flex container items-center justify-between w-full py-3 rounded">
                    <h1 className="font-bold">Entries</h1>
                    <div className='flex item-center'>
                        <div className="bg-gray-200 text-sm text-gray-500 leading-none border-2 border-gray-200 rounded inline-flex mr-10">
                            <button onClick={() => this.showDisplay(EntriesDisplay.Grid)} className={`inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 px-4 py-2 ${this.state.display === EntriesDisplay.Grid && 'active'}`} id="grid">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="fill-current w-4 h-4 mr-2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                <span className="font-semibold">Grid</span>
                            </button>
                            <button onClick={() => this.showDisplay(EntriesDisplay.List)} className={`inline-flex items-center transition-colors duration-300 ease-in focus:outline-none text-semibold hover:text-blue-400 focus:text-blue-400 px-4 py-2 ${this.state.display === EntriesDisplay.List && 'active'}`} id="list">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="fill-current w-4 h-4 mr-2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                                <span className="font-semibold">List</span>
                            </button>
                        </div>
                        <button onClick={this.toggleUpload} className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-400 font-semibold py-2 px-5 shadow rounded">
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
                                                        <span>Drag and drop</span>&nbsp;<span>images anywhere or</span>
                                                    </p>
                                                    <input {...getInputProps()}/>
                                                    <button id="button" onClick={this.promptUpload} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow-sm">
                                                        Upload
                                                    </button>
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
                    {this.state.tournament.entries.map((entry) => 
                        <TournamentEntry
                            display={this.state.display}
                            entry={entry}
                            handleDelete={() => this.deleteEntry(entry)}
                            handleEdit={this.editEntry}
                        />
                    )}
                </div>
            </div>
        )
    }
}

export default TournamentEntries