import React from 'react';
import { toast } from 'react-toastify';
import { isValidData, uppercaseFirstCharacter } from '../Assets/js/common';
import { setLocalStorage } from '../scripts/getSetLocalStrorage';

class SongCard extends React.Component {

    constructor(props) {
        super();
        this.state = {
            showPlaylists: false
        }
        this.togglePlaylistVisibility = this.togglePlaylistVisibility.bind(this);
        this.renderPlaylists = this.renderPlaylists.bind(this);
        this.card = this.card.bind(this);
        this.addToPlaylist = this.addToPlaylist.bind(this);
    }

    addToPlaylist(playList, song) {
        var existingPlaylist = this.props.playlists
        var newSongToThePlaylist = song
        newSongToThePlaylist.dateCreated = Date.parse(new Date())

        var filterPlaylistData = existingPlaylist.findIndex((obj => obj.id == playList.id))
        var checkExistenceOfSong = existingPlaylist[filterPlaylistData].songs.findIndex((item => item.id == song.id))
        console.log("checkExistenceOfSong:", checkExistenceOfSong)
        if (checkExistenceOfSong === -1) {
            existingPlaylist[filterPlaylistData].songs.push(newSongToThePlaylist)
            toast.success(uppercaseFirstCharacter(song.title) + " has been added to the playlist " + playList.name)
            this.props.updateParent(existingPlaylist)
            setLocalStorage("playlist", JSON.stringify(existingPlaylist))
        } else {
            toast.error("Song already exists in the playlist");
        }
    }

    renderPlaylists(playList, song) {
        return (
            <div className='button' onClick={() => this.addToPlaylist(playList, song)}>
                <div className='card-title'>+ Add to {playList.name}                </div>
            </div>
        )
    }

    togglePlaylistVisibility() {
        this.setState({
            showPlaylists: !this.state.showPlaylists
        })
    }

    card(song) {
        if (song) {
            return (
                <div key={song.id} className='col-2 card'>
                    <img className="card-img-top" src={song.url} alt={song.title}></img>
                    <div className='card-body'>
                        <h5 className='card-title'>{song.title}</h5>
                        <p className='card-text'>Album: <p className='card-text'>{song.albumName}</p></p>

                    </div>
                    {
                        isValidData(this.props.playlists) ?
                            <div className="card-footer">
                                <div className="dropdown">
                                    <a className="btn btn-secondary btn-circle dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" id={"dropdown" + song.id} data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        + Add to playlist
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby={"dropdown" + song.id}>

                                        {this.props.playlists.map((item) => this.renderPlaylists(item, song))}

                                    </ul>
                                </div>
                            </div>
                            : null
                    }
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