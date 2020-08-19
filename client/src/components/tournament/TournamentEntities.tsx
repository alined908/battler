import React, {Component} from 'react'
import {RouteComponentProps} from 'react-router-dom'
import {Tournament as TournamentType, TournamentEntry as TournamentEntryType} from '../../interfaces'
import {axiosClient} from '../../tools/axiosClient'

interface TournamentEntitiesProps {
    tournament: TournamentType
}

interface TournamentEntitiesState {
    tournament: TournamentType
    image: File | null,
    imageURL: string
}

class TournamentEntities extends Component<TournamentEntitiesProps, TournamentEntitiesState> {

    state : TournamentEntitiesState = {
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
            url: `api/tournaments/${this.props.tournament.id}/photos/`,
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

    addEntity = (event : any) => {
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

    updateEntities = (entry: TournamentEntryType) => {
        this.setState({tournament: {...this.state.tournament, entries: [...this.state.tournament.entries, entry]}})
    }

    render() {
        return (
            <div>
                Entities
                <div>
                    {this.state.tournament.entries.map((entry) => 
                        <div className="max-w-sm rounded overflow-hidden shadow-lg">
                            <img className="w-full" src={entry.photo} alt={entry.title}/>
                        </div>
                    )}
                </div>
                <input
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                    onChange={this.addEntity}
                    id="icon-button-file"
                    type="file"
                />
                <label htmlFor="icon-button-file">
                    <button aria-label="upload">
                        Upload
                    </button>
                </label>
                {this.state.image && 
                    <div>
                        <span>{this.state.image.name}</span>
                        <img src={this.state.imageURL}/>
                    </div>
                }
            </div>
        )
    }
}

export default TournamentEntities