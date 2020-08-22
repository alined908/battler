import React, {Component} from 'react'
import {Tournament as TournamentType} from '../../interfaces'
import {Dialog, DialogTitle, DialogContent, DialogActions} from '@material-ui/core'
import {axiosClient} from '../../tools/axiosClient'

interface EditProps {
    tournament: TournamentType
    open: boolean
    toggleForm: () => void
    updateTournament: (tournament: TournamentType) => void
}

interface EditState {
    title: string,
    description: string,
    tagInput: string,
    tags: string[],
    imageUpload: {
        image: any,
        imageURL: string | null | undefined
    }
}

class TournamentEditForm extends Component<EditProps, EditState> {
    private tagInput: any

    state : EditState = {
        title: this.props.tournament.title,
        description: this.props.tournament.description,
        imageUpload: {
            image: null,
            imageURL: ''
        },
        tagInput: '',
        tags: this.props.tournament.tags
    }

    handleField = (e:React.ChangeEvent<HTMLInputElement>, key : string) => {
        this.setState({[key as any] : e.target.value} as Pick<EditState, keyof EditState>);
    }

    removeTag = (i: number) => {
        console.log(i)
        this.setState({
            tags: [...this.state.tags.slice(0, i), ...this.state.tags.slice(i + 1)]
        })
    }

    handleTagsInput = (e: React.KeyboardEvent) => {
        const value = (e.target as HTMLInputElement).value

        if (e.key === 'Enter' && value){
            if (this.state.tags.find(tag => tag.toLowerCase() === value.toLowerCase())) {
                return
            }
            this.setState({
                tags: [...this.state.tags, value]
            })
            this.tagInput.value = ''
        } else if (e.key === 'Backspace' && !value) {
            this.removeTag(this.state.tags.length - 1)
        }
    }

    handleUploadClick = (e: React.SyntheticEvent) => {
        e.preventDefault()
        const input = document.getElementById('icon-button-file')
        input!.click()
    }

    handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        var reader = new FileReader();
        let file = (e.target as any).files[0];
    
        reader.onloadend = () => {
          this.setState({imageUpload: {
            image: file,
            imageURL: reader.result as string
          }});
        };
    
        reader.readAsDataURL(file);
    };

    submitForm = () => {
        let data = new FormData();

        if (this.state.imageUpload.image) {
            console.log('hello')
            console.log(this.state.imageUpload.image)
            console.log(this.state.imageUpload.imageURL)
            data.append("avatar", this.state.imageUpload.image, this.state.imageUpload.image.name);
        }
        data.append('title', this.state.title)
        data.append('description', this.state.description)
        data.append('tags', JSON.stringify(this.state.tags))

        axiosClient.request({
            url: `api/tournaments/${this.props.tournament.url}/`,
            method: 'PATCH',
            data
        }).then((response) => {
            console.log(response.data)
            this.props.updateTournament(response.data)
            this.props.toggleForm()
        }).catch((error) => {
            console.log(error)
        })
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.toggleForm} maxWidth="sm" fullWidth={true}>
                <DialogTitle>
                    <div className="flex items-center justify-between">
                        <span>
                            Edit Tournament
                        </span>
                        <div onClick={this.props.toggleForm} className="cursor-pointer hover:shadow-md rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18pt" height="18pt" viewBox="0 0 18 18" version="1.1">
                                <g id="surface1">
                                    <path style={{fill:"#000",strokeWidth:"32",strokeLinecap:"round",strokeLinejoin:"round", stroke: "rgb(0%,0%,0%)",strokeOpacity: 1,strokeMiterlimit:4}} d="M 368 368 L 144 144" transform="matrix(0.0351562,0,0,0.0351562,0,0)"/>
                                    <path style={{fill:"#000",strokeWidth:"32",strokeLinecap:"round",strokeLinejoin:"round", stroke: "rgb(0%,0%,0%)",strokeOpacity: 1,strokeMiterlimit:4}} d="M 368 144 L 144 368" transform="matrix(0.0351562,0,0,0.0351562,0,0)"/>
                                </g>
                            </svg>
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <form className="w-full py-2">
                        <div className="flex flex-wrap">
                            <div className="w-full px-3 mb-4">
                                <label className="block text-xs font-bold mb-2" htmlFor="title">
                                    Title
                                </label>
                                <input id='title' className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" value={this.state.title} onChange={(e) => this.handleField(e, 'title')}/>
                            </div>
                            <div className="w-full px-3 mb-4">
                                <label className="block text-xs font-bold mb-2" htmlFor="description">
                                    Description
                                </label>
                                <input id='description' className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text" value={this.state.description} onChange={(e) => this.handleField(e, 'description')}/>
                            </div>
                        
                            <div className="w-full px-3">
                                <label className="block text-xs font-bold mb-2" htmlFor="tags">
                                    Tags
                                </label>
                                <div className="tag-input-wrapper">
                                    {this.state.tags.map((tag, i) => 
                                        <div
                                        className="px-2 mr-2 text-xs flex bg-white text-blue-400 items-center font-semibold leading-sm py-1 rounded border"
                                        >
                                            {tag}
                                            <span className="cursor-pointer">
                                                <svg id="close-button" onClick={() => this.removeTag(i)} className="ml-2 h-2 w-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 375">
                                                    <g ill-rule="nonzero">
                                                        <path d="M368.663 339.414L35.873 6.624c-8.076-8.076-21.172-8.076-29.249 0-8.076 8.077-8.076 21.173 0 29.25l332.79 332.79c8.078 8.076 21.172 8.076 29.25 0 8.076-8.078 8.076-21.172 0-29.25z"></path><path d="M339.414 6.624L6.624 339.414c-8.076 8.077-8.077 21.172 0 29.25 8.078 8.076 21.173 8.076 29.25 0l332.79-332.79c8.076-8.078 8.076-21.172 0-29.25-8.078-8.077-21.172-8.077-29.25 0z">
                                                        </path>
                                                    </g>
                                                </svg>
                                            </span>
                                        </div>

                                    )}
                                    <input className="tag-input focus:border-gray-500" ref={c => { this.tagInput = c; }} onKeyUp={this.handleTagsInput} placeholder="Type and press enter"/>
                                </div>
                            </div>
                            <div className="w-full px-3 mb-4">
                                <label className="block text-xs font-bold mb-2" htmlFor="avatar">
                                    Avatar
                                </label>
                                <div>
                                    <input
                                        onChange={this.handleImageChange}
                                        id="icon-button-file"
                                        type="file"
                                        className="hidden"
                                    />
                                    <label htmlFor="icon-button-file">
                                        <button type="button" onClick={this.handleUploadClick} className="inline-flex items-center mr-1 bg-white hover:bg-gray-100 text-gray-800 text-sm font-semibold py-2 px-3 shadow rounded"><svg fill="#000" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"></path></svg>Upload</button>
                                    </label>
                                </div>
                                <div className="flex items-center mt-4">
                                    {this.props.tournament.avatar &&
                                        <div className="rounded overflow-hidden shadow-md w-24 h-24">
                                            <img src={this.props.tournament.avatar} className="w-24 object-cover h-24"/>
                                        </div>
                                    }
                                    {this.state.imageUpload.image && this.props.tournament.avatar &&
                                        <span className='text-sm'>
                                            New Avatar
                                        </span>
                                    }
                                    {this.state.imageUpload.imageURL && 
                                        <div className="rounded overflow-hidden shadow-md w-24 h-24">
                                            <img src={this.state.imageUpload.imageURL} className="w-24 object-cover h-24"/>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <button onClick={this.props.toggleForm} className="bg-white hover:bg-gray-100 text-xs text-red-500 border font-semibold py-2 px-3 rounded">
                        Close
                    </button>
                    <button onClick={this.submitForm} className="bg-white hover:bg-gray-100 text-xs text-blue-500 border font-semibold py-2 px-3 rounded">
                        Submit
                    </button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default TournamentEditForm