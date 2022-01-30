import React from 'react';
import { toast } from 'react-toastify';
import _bgImage from '../Assets/Images/bgImage.jpg'
import { HTTP_URL } from '../axiosConfig';
import { getLocalStorage, setLocalStorage } from '../scripts/getSetLocalStrorage';
import LazyLoad from 'react-lazyload';
import SongCard from './songCard';
import ReactPaginate from 'react-paginate';
import { isValidData } from '../Assets/js/common';

class BodyContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            pageCount: 24,
            selectedAlbum: null,
            selectedSong: null,
            userPlaylist: getLocalStorage("playlist") ? JSON.parse(getLocalStorage("playlist")) : setLocalStorage("playlist", JSON.stringify([{ id: "Favourites", name: "Favourites", songsIds: [] }])),
            bgImage: _bgImage,
            albumList: null,
            songList: null,
            songsWithAlbums: [],
            filteredSongs: [],
            itemOffset: 0,
            searchedSong: "",
            currentPage: 0
        }
        this.setPlaylistName = this.setPlaylistName.bind(this);
        this.getAlbums = this.getAlbums.bind(this);
        this.getSongs = this.getSongs.bind(this);
        this.renderAlbum = this.renderAlbum.bind(this);
        this.renderSongs = this.renderSongs.bind(this);
        this.updateSelectedAlbum = this.updateSelectedAlbum.bind(this);
        this.mapSongsWithAlbums = this.mapSongsWithAlbums.bind(this);
        this.updateSelectedAlbum = this.updateSelectedAlbum.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.filterSongs = this.filterSongs.bind(this);
        this.searchData = this.searchData.bind(this);
        this.paginateResult = this.paginateResult.bind(this);
    }

    getAlbums() {
        HTTP_URL.get("/albums").then((response) => {
            this.setState({
                albumList: response.data
            })
            setLocalStorage("albums", JSON.stringify(response.data))
        }).catch((error) => {
            toast.error("Something went wrong. Try again later");
        })
    }

    pagination() {
        return (
            <div className='col-6 col-offset-3'>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={this.handlePageClick}
                    pageRangeDisplayed={5}
                    forcePage={this.state.currentPage}
                    pageCount={Math.ceil(this.state.filteredSongs.length / this.state.pageCount)}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                />
            </div>
        )
    }

    filterSongs() {
        var searchedSongOrAlbum = this.state.searchedSong
        var allSongs = this.state.songsWithAlbums
        var searchedResult = []
        for (var songIndex = 0; songIndex < allSongs.length; songIndex++) {
            if (allSongs[songIndex].title.includes(searchedSongOrAlbum) || allSongs[songIndex].albumName.includes(searchedSongOrAlbum))
                searchedResult.push(allSongs[songIndex])
        }
        this.setState({
            filteredSongs: isValidData(searchedResult) ? searchedResult : allSongs
        }, () => this.paginateResult())
    }

    paginateResult() {
        var resultSet = []
        for (var count = this.state.itemOffset; count < this.state.itemOffset + this.state.pageCount; count++) {
            resultSet.push(this.state.filteredSongs[count])
        }
        this.setState({
            finalRenderData: resultSet
        })
    }

    setPlaylistName(e) {
        this.setState({
            newPlaylistName: e.target.value
        })
    }

    searchData(e) {
        this.setState({
            searchedSong: e.target.value ? e.target.value : "",
            currentPage: 0,
            itemOffset: 0
        }, () => this.filterSongs())
    }

    renderPlaylist(playlist) {
        return (
            <li>{playlist.name}</li>
        )
    }

    updateSelectedAlbum(album) {
        this.setState({
            searchedSong: album.title,
            selectedAlbumId: album.id,
            currentPage: 0,
            itemOffset: 0
        }, () => this.filterSongs())
    }

    mapSongsWithAlbums(_songs, _albums) {
        var _songsWithAlbums = []
        for (let index = 0; index < _songs.length; index++) {
            var mapAlbumName = _albums.filter((item) => item.id === _songs[index].albumId)
            var song = _songs[index]
            song.albumName = mapAlbumName[0].title
            _songsWithAlbums.push(song)
        }
        this.setState({
            songsWithAlbums: _songsWithAlbums,
            filteredSongs: _songsWithAlbums
        }, () => this.filterSongs())
    }

    getSongs() {
        HTTP_URL.get("/photos").then((response) => {
            this.setState({
                songList: response.data
            }, () => this.mapSongsWithAlbums(this.state.songList, this.state.albumList))
            setLocalStorage("songs", JSON.stringify(response.data))
        }).catch((error) => {
            toast.error("Something went wrong. Try again later");
        })
    }

    renderAlbum(album) {
        return (
            <li key={album.id} onClick={() => this.updateSelectedAlbum(album)}>
                <p className='card-title'>{album.title}</p>
            </li>
        )
    }

    handlePageClick = (event) => {
        const newOffset = (event.selected * this.state.pageCount) % this.state.filteredSongs.length;
        this.setState({
            currentPage: event.selected,
            itemOffset: newOffset
        }, () => this.paginateResult())
    };

    renderSongs(songData) {
        return <SongCard song={songData} />
    }

    createNewPlaylist() {
        var existingPlaylist = this.state.userPlaylist
        var data = {
            name: this.state.newPlaylistName,
            id: this.state.newPlaylistName,
            songsId: []
        }
        existingPlaylist.push(data)
        setLocalStorage("playlist", JSON.stringify(existingPlaylist))
        this.setState({
            userPlaylist: existingPlaylist,
            newPlaylistName: ""
        })
    }

    render() {

        return (
            <div className='row' style={{ height: '100%', width: '100%' }}>
                <div className="modal" id="playlistModal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Modal title</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Modal body text goes here.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary">Save changes</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid" style={{ height: '100%', width: '100%' }}>

                    <div className='row' style={{ backgroundImage: this.state.bgImage, height: "100%" }}>
                        <div className='col-3'>
                            <h4>Search</h4><br />
                            <input type="text" className="" placeholder='Search album or song' onChange={this.searchData} name="searchedSong" value={this.state.searchedSong} />
                            <div>
                                <hr />

                                <h4>User playlist</h4><br />
                                {
                                    isValidData(this.state.userPlaylist) ?
                                        <ul>

                                            {
                                                this.state.userPlaylist.map(this.renderPlaylist)}
                                            <li>
                                                <input type="text" placeholder='+ Create new' value={this.state.newPlaylistName} onChange={this.setPlaylistName} name="newPlaylistName" />
                                                <span className='btn btn-primary' onClick={() => this.createNewPlaylist()}>Create</span>
                                            </li>

                                        </ul>
                                        :
                                        <ul>
                                            <li><input type="text" placeholder='+ Create new' value={this.state.newPlaylistName} name="newPlaylistName" onChange={this.setPlaylistName} /><span className='btn btn-primary' onClick={() => this.createNewPlaylist()}>Create</span></li>
                                        </ul>
                                }
                                <hr />
                                <h4>Albums</h4>
                                <ul style={{ height: "600px", overflow: "auto" }}>
                                    {
                                        isValidData(this.state.albumList) ?
                                            this.state.albumList.map(this.renderAlbum)
                                            : "Loading..."
                                    }

                                </ul>
                            </div>
                        </div>
                        <div className='row col-9'>
                            {this.pagination()}
                            <div style={{ height: "800px", overflow: "auto" }}>
                                <LazyLoad height={200} once>
                                    <div className='row'>
                                        {
                                            isValidData(this.state.finalRenderData) ?
                                                <SongCard songs={this.state.finalRenderData} pageCount={this.state.pageCount} startPoint={this.state.itemOffset} />
                                                : "No data"
                                        }
                                    </div>
                                </LazyLoad>

                            </div>
                            {this.pagination()}
                        </div>
                    </div>
                </div>
            </div >

        )
    }

    componentDidMount() {
        var localAlbums = getLocalStorage('albums') ? JSON.parse(getLocalStorage('albums')) : null
        var localSongs = getLocalStorage('songs') ? JSON.parse(getLocalStorage('songs')) : null
        //Network request will be made at the first time and will be stored locally
        if (!localAlbums)
            this.getAlbums();
        else {
            this.setState({
                albumList: localAlbums,
                firstTime: true
            })
        }

        if (!localSongs)
            this.getSongs();
        else {
            this.setState({
                songList: localSongs,
                firstTime: true
            })
        }

        if (localAlbums && localSongs) {
            this.mapSongsWithAlbums(localSongs, localAlbums)
        }
    }

}

export default BodyContent;