import React from 'react';
import { isValidData } from '../Assets/js/common';

class SongCard extends React.Component {

    constructor(props) {
        super();
        this.state = {
            showPlaylists: false
        }
        this.togglePlaylistVisibility = this.togglePlaylistVisibility.bind(this);
        this.renderPlaylists = this.renderPlaylists.bind(this);
        this.card = this.card.bind(this);
    }

    renderPlaylists(playList) {
        return (
            <li>{playList.name}<br /></li>
        )
    }

    togglePlaylistVisibility() {
        this.setState({
            showPlaylists: !this.state.showPlaylists
        })
    }

    card(song) {
        console.log("data:", this.state.showPlaylists, this.props.playlists)
        if (song) {
            return (
                <div key={song.id} className='col-2 card'>
                    <img className="card-img-top" src={song.url} alt={song.title}></img>
                    <div className='card-body'>
                        <h5 className='card-title'>{song.title}</h5>
                        <p className='card-text'>Album: {song.albumName}</p>

                    </div>
                    <div className="card-footer">
                        <div className="dropdown">
                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                + Add to playlist <i className="fas fa-ellipsis-v"></i>
                            </a>

                            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                {this.props.playlists.map(this.renderPlaylists)}
                            </div> :

                        </div>
                    </div>
                </div >
            )
        }
    }
    render() {
        return (
            this.props.songs.map(this.card)
        )
    }
}

export default SongCard;