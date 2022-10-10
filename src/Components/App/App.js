import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import PlayList from "../Playlist/Playlist";
import Playlists from "../Playlists/Playlists";
import Spotify from "../../util/Spotify";
import Player from "../Player/Player";
import React from "react";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchResults: [],
			playlistName: "New Playlist",
			playlistTracks: [],
			userPlaylists: [],
			activeTrack: "",
			activeTrackInfo: "",
			player: "",
			context: "",
			playerConnected: false,
			playing: false,
			createNew: false,
			auth: false,
		};
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
		this.search = this.search.bind(this);
		this.auth = this.auth.bind(this);
		this.listPlaylists = this.listPlaylists.bind(this);
		this.fetchTracks = this.fetchTracks.bind(this);
		this.setSong = this.setSong.bind(this);
		this.setPlayer = this.setPlayer.bind(this);
		this.connect = this.connect.bind(this);
		this.updatePlayState = this.updatePlayState.bind(this);
		this.deletePlaylist = this.deletePlaylist.bind(this);
		this.stopSong = this.stopSong.bind(this);
		this.updateTrack = this.updateTrack.bind(this);
		this.setVolume = this.setVolume.bind(this);
		this.awaitSetState = this.awaitSetState.bind(this);
	}
	awaitSetState(newState) {
		return new Promise((r) => this.setState(newState, r));
	}
	addTrack(track) {
		const tracks = this.state.playlistTracks;
		if (tracks.find((savedTrack) => savedTrack.id === track.id)) return;
		tracks.push(track);
		this.setState({ playlistTracks: tracks });
	}
	removeTrack(track) {
		const tracks = this.state.playlistTracks;
		if (
			typeof tracks.find((savedTrack) => savedTrack.id === track.id) ===
			"undefined"
		)
			return;
		const filteredTracks = tracks.filter(
			(savedTrack) => savedTrack.id !== track.id
		);
		this.setState({ playlistTracks: filteredTracks });
	}
	updatePlaylistName(name) {
		this.setState({ playlistName: name });
	}
	savePlaylist() {
		const trackURIs = this.state.playlistTracks.map((track) => track.uri);
		Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
			this.setState({ playlistName: "New Playlist", playlistTracks: [] });
		});
	}
	search(term) {
		Spotify.search(term).then((searchResults) => {
			this.setState({ searchResults: searchResults });
		});
	}
	auth() {
		Spotify.getAccessToken();
		this.listPlaylists();
	}
	listPlaylists() {
		Spotify.getPlaylists().then((playlists) =>
			this.setState({ userPlaylists: playlists })
		);
	}
	deletePlaylist(playlistId) {
		return Spotify.deletePlaylist(playlistId);
	}
	async fetchTracks(href) {
		const tracks = await Spotify.fetchTracks(href);
		return tracks;
	}
	setPlayer(player, cb) {
		this.setState({ player: player }, cb);
	}
	async setSong(songURI, context) {
		if (!songURI) {
			this.setState({ playing: true }, () => {
				Spotify.playSongs(this.state.player);
			});
			return;
		}
		if (!context) {
			this.setState({ activeTrack: songURI }, () =>
				Spotify.playSongs(this.state.player, this.state.activeTrack)
			);
			this.setState({ playing: true });
			this.setState({ context: "" });
			return;
		}
		this.setState({ context: context }, () => {
			this.setState({ activeTrack: songURI }, () =>
				Spotify.playSongs(this.state.player, this.state.activeTrack, context)
			);
			this.setState({ playing: true });
		});
		return;
	}
	async connect() {
		if (!this.state.player && !this.state.playerConnected) {
			return setTimeout(() => {
				this.connect();
			}, 200);
		}
		if (this.state.player && !this.state.playerConnected) {
			await Spotify.connectPlayer(this.state.player);
			await this.awaitSetState({ playerConnected: true });
		}
		return;
	}

	updatePlayState(isPaused) {
		this.setState({ playing: isPaused });
	}
	async stopSong() {
		this.setState({ playing: false }, () => {
			Spotify.stopSong(this.state.player);
		});
	}
	updateTrack(trackUri) {
		this.setState({ activeTrack: trackUri });
	}
	setVolume(percentage) {
		Spotify.setVolume(percentage, this.state.player);
	}
	async componentDidMount() {
		if (sessionStorage.getItem("auth") === "true")
			this.setState({ auth: true });
		await this.connect();
		if (sessionStorage.getItem("search")) {
			setTimeout(() => {
				document.querySelector(".SearchButton").click();
				sessionStorage.setItem("search", "");
			}, 500);
		}
		return;
	}
	async componentDidUpdate(prevProp, prevState) {
		if (prevState.activeTrack !== this.state.activeTrack) {
			const info = await Spotify.fetchTrackInfo(this.state.activeTrack);
			this.setState({
				activeTrackInfo: {
					name: info.name,
					artist: info.artists[0].name,
					album: info.album.name,
				},
			});
		}
		if (this.state.createNew) {
			const elements = document.querySelectorAll(".SearchBar, .App-playlist");
			elements.forEach((e) => (e.style.display = "flex"));
		}
	}
	render() {
		return (
			<>
				<h1>
					Spot<span className="highlight"> On! </span>
				</h1>

				<div>
					<Player
						token={Spotify.getAccessToken()}
						setPlayer={this.setPlayer}
						song={this.state.activeTrack}
						play={this.connect}
						status={this.state.playerConnected}
						updatePlayState={this.updatePlayState}
						isPaused={this.state.playing}
						updateTrack={this.updateTrack}
						setVolume={this.setVolume}
						context={this.state.context}
						setSong={this.setSong}
						getTracks={this.fetchTracks}
						activeTrackInfo={this.state.activeTrackInfo}
					/>
					<div className="App">
						<h2 className="Description">Manage your Spotify library online</h2>
						<Playlists
							authStatus={this.state.auth}
							playlists={this.state.userPlaylists}
							onMount={this.listPlaylists}
							getTracks={this.fetchTracks}
							setSong={this.setSong}
							deletePlaylist={this.deletePlaylist}
							stopSong={this.stopSong}
							activeTrack={this.state.activeTrack}
							activeTrackName={this.state.activeTrackInfo}
							playerConnected={this.state.playerConnected}
							playing={this.state.playing}
							awaitSetState={this.awaitSetState}
						/>
						<SearchBar onSearch={this.search} />
						<div className="App-playlist">
							<SearchResults
								searchResults={this.state.searchResults}
								onAdd={this.addTrack}
								setSong={this.setSong}
								stopSong={this.stopSong}
								activeTrack={this.state.activeTrack}
								activeTrackName={this.state.activeTrackInfo}
								playerConnected={this.state.playerConnected}
								playing={this.state.playing}
								playlistTracks={this.state.playlistTracks}
							/>
							<PlayList
								playlistName={this.state.playlistName}
								playlistTracks={this.state.playlistTracks}
								onRemove={this.removeTrack}
								onNameChange={this.updatePlaylistName}
								onSave={this.savePlaylist}
								setSong={this.setSong}
								stopSong={this.stopSong}
								activeTrack={this.state.activeTrack}
								activeTrackName={this.state.activeTrackInfo}
								playerConnected={this.state.playerConnected}
								playing={this.state.playing}
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default App;
