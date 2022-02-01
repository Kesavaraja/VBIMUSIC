import React from 'react';
import { toast } from 'react-toastify';
import _bgImage from '../Assets/Images/bgImage.jpg'
import { HTTP_URL } from '../axiosConfig';
import { getLocalStorage, setLocalStorage } from '../scripts/getSetLocalStrorage';
import LazyLoad from 'react-lazyload';
import SongCard from './songCard';
import ReactPaginate from 'react-paginate';
import { DATEFORMAT, isValidData, shuffle } from '../Assets/js/common';
import Accordion from 'react-bootstrap/Accordion';
import dateFormat from "dateformat";
import Header from './header';

class BodyContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            pageCount: 24,
            selectedAlbum: null,
            selectedSong: null,
            userPlaylist: getLocalStorage("playlist") ? JSON.parse(getLocalStorage("playlist")) : setLocalStorage("playlist", JSON.stringify([{ id: "Favourites", name: "Favourites", songs: [] }])),
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
        this.renderPlaylist = this.renderPlaylist.bind(this);
        this.updatePlaylistToParent = this.updatePlaylistToParent.bind(this);
        this.shuffleChoosenPlaylist = this.shuffleChoosenPlaylist.bind(this);
        this.createNewPlaylist = this.createNewPlaylist.bind(this);
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
            <div className='col-12 text-center'>
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
            if (allSongs[songIndex].title.includes(searchedSongOrAlbum.toLowerCase()) || allSongs[songIndex].albumName.includes(searchedSongOrAlbum.toLowerCase()))
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

    renderPlaylistSongs(song) {
        return (
            <div >
                <h6 className='card-title'>{song.title}</h6>
                <p className='card-text float-right'>
                    <p>Added on: {dateFormat(song.dateCreated, DATEFORMAT)}</p>
                </p>
                <hr />
            </div>
        )
    }

    shuffleChoosenPlaylist(choosenPlaylist) {
        choosenPlaylist.songs = shuffle(choosenPlaylist.songs)
        var allPlaylists = this.state.userPlaylist
        var indexNumber = allPlaylists.findIndex((item) => item.name === choosenPlaylist.name)
        console.log("indeNumber:", indexNumber)
        allPlaylists.splice(indexNumber, 1, choosenPlaylist)
        this.setState({
            userPlaylist: allPlaylists
        })
    }

    renderPlaylist(playlist) {
        return (
            <Accordion.Item eventKey={playlist.name}>
                <Accordion.Header>{playlist.name}</Accordion.Header>
                <Accordion.Body>
                    {
                        isValidData(playlist.songs) ?
                            <div>
                                {playlist.songs.map(this.renderPlaylistSongs)}
                                <div className="text-center">
                                    <span className="btn btn-primary" onClick={() => this.shuffleChoosenPlaylist(playlist)}> <i className="fas fa-random"></i> Shuffle songs</span>
                                </div>
                            </div>
                            : "Add some songs to " + playlist.name}
                </Accordion.Body>
            </Accordion.Item>
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

    createNewPlaylist(playListName) {
        console.log("userPlaylist:", playListName, this.state)
        var existingPlaylist = isValidData(this.state.userPlaylist) ? this.state.userPlaylist : []
        var data = {
            name: playListName,
            id: playListName,
            songs: [],
            dateCreated: Date.parse(new Date())
        }
        existingPlaylist.push(data)
        setLocalStorage("playlist", JSON.stringify(existingPlaylist))
        toast.success(data.name + " playlist has been created")
        this.setState({
            userPlaylist: existingPlaylist,
            newPlaylistName: ""
        })
    }

    updatePlaylistToParent(playlistData) {
        this.setState({
            userPlaylist: playlistData
        })
    }

    render() {

        return (
            <div className='row' style={{ height: '100%', width: '100%' }}>
                <div className="container-fluid" style={{ height: '100%', width: '100%' }}>

                    <div className='row' style={{ backgroundImage: this.state.bgImage, height: "100%" }}>
                        <div className='col-3 container'>
                            <Header />
                            <h3>Welcome to VBI Music, Guest</h3>
                            <hr />
                            <h4>Search</h4><br />
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder='Search album or song' onChange={this.searchData} name="searchedSong" value={this.state.searchedSong} />
                                <div className='input-group-append'>
                                    <span className='btn btn-primary' onClick={this.filterSongs}>Search</span>
                                </div>
                            </div>
                            <div>
                                <hr />

                                <h4>User playlist</h4> <hr />
                                {
                                    isValidData(this.state.userPlaylist) ?
                                        <Accordion defaultActiveKey="0" flush>
                                            {this.state.userPlaylist.map(this.renderPlaylist)}
                                        </Accordion>
                                        :
                                        <div>No playlist available</div>
                                } <hr />
                                <div className="input-group">
                                    <input type="text" className='form-control' placeholder='+ Create new playlist' value={this.state.newPlaylistName} onChange={this.setPlaylistName} name="newPlaylistName" />
                                    <span class="input-group-append">
                                        <span className='btn btn-primary pull-right' onClick={() => this.createNewPlaylist(this.state.newPlaylistName)}>Create</span>
                                    </span>

                                </div>
                                <hr />
                                <h4>Albums</h4>
                                <ul style={{ height: "250px", overflow: "auto" }}>
                                    {
                                        isValidData(this.state.albumList) ?
                                            this.state.albumList.map(this.renderAlbum)
                                            : "Loading..."
                                    }

                                </ul>
                            </div>
                        </div>
                        <div className='row col-9'>
                            <div className="card">
                                {this.pagination()}
                                <div style={{ height: "800px", overflow: "auto" }}>
                                    <LazyLoad height={200} once>
                                        <div className='row card-deck'>
                                            {
                                                isValidData(this.state.finalRenderData) ?
                                                    <SongCard songs={this.state.finalRenderData} playlists={this.state.userPlaylist} updateParent={this.updatePlaylistToParent} pageCount={this.state.pageCount} startPoint={this.state.itemOffset} />
                                                    : "No data"
                                            }
                                        </div>
                                    </LazyLoad>

                                </div>
                                {this.pagination()}
                            </div>
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