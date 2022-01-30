import React from 'react';

class SongCard extends React.Component {
    card(song) {
        if (song) {

            return (
                <div key={song.id} className='col-2 card'>
                    <img className="card-img-top" src={song.url} alt={song.title}></img>
                    <div className='card-body'>
                        <h5 className='card-title'>{song.title}</h5>
                        <p className='card-text'>Album: {song.albumName}</p>
                    </div>
                    <div className='card-bottom'>
                        <span onClick={this.props.addTo}> + Add to playlist</span>
                    </div>
                </div>
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