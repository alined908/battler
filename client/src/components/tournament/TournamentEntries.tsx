import React, {Component} from 'react'
import {Tournament as TournamentType, TournamentEntry as TournamentEntryType} from '../../interfaces'
import {axiosClient} from '../../tools/axiosClient'
import {TournamentEntry} from '../components'

interface TournamentEntriesProps {
    tournament: TournamentType
}

interface TournamentEntriesState {
    tournament: TournamentType
    image: File | null,
    imageURL: string
}

class TournamentEntries extends Component<TournamentEntriesProps, TournamentEntriesState> {

    state : TournamentEntriesState = {
        tournament: this.props.tournament,
        image: null,
        imageURL: ''
    }

    submitEntity = () => {
        let data = new FormData();

        if (this.state.image) {
            data.append("photo", this.state.image, this.state.image.name)
            data.append('tournament', this.props.tournament.id)
            data.append('title', this.state.image.name)
        }
        
        axiosClient.request({
            url: `api/tournaments/${this.props.tournament.id}/entry/`,
            method: 'POST',
            data: data,
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

    addEntry = (event : any) => {
        let reader = new FileReader();
        let file = event.target.files[0]

        reader.onloadend = () => {
            this.setState({
                image: file,
                imageURL: reader.result as string,
            }, () => this.submitEntity());
        };

        reader.readAsDataURL(file);
    }

    promptUpload = () => {
        const hiddenButton = document.getElementById('hidden-input')
        hiddenButton?.click()
    }

    updateEntities = (entry: TournamentEntryType) => {
        this.setState({tournament: {...this.state.tournament, entries: [...this.state.tournament.entries, entry]}})
    }

    render() {
        return (
            <div className="p-2">
                <div className="flex items-center flex-col my-4">
                    <div className="w-full sm:py-8">
                        <div className="container mx-auto">
                            <div aria-label="File Upload Modal" className="relative flex flex-col rounded-md" >
                                <div className="h-full overflow-auto w-full h-full flex flex-col">
                                    <div className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                                        <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                                            <span>Drag and drop</span>&nbsp;<span>images anywhere or</span>
                                        </p>
                                        <input id="hidden-input" onChange={this.addEntry} type="file" multiple className="hidden" />
                                        <button id="button" onClick={this.promptUpload} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow-sm">
                                            Upload
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* {this.state.image && 
                    <div>
                        <span>{this.state.image.name}</span>
                        <img src={this.state.imageURL}/>
                    </div>
                } */}
                <div className="grid w-full xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                    {this.state.tournament.entries.map((entry) => 
                        <TournamentEntry 
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