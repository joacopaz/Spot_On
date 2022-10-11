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
			isMock: false,
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
		this.generateMockData = this.generateMockData.bind(this);
	}
	generateMockData() {
		sessionStorage.setItem("isMock", "true");
		this.setState({
			searchResults: [
				{
					album: "Cold Heart (PNAU Remix)",
					artist: "Elton John",
					name: "Cold Heart",
					id: 4,
				},
				{
					album: "Hold Me Closer",
					artist: "Elton John",
					name: "Hold Me Closer",
					id: 5,
				},
				{
					album: "Elton John - Deluxe edition",
					artist: "Elton John",
					name: "Your Song",
					id: 6,
				},
				{
					album: "Madman Across The Water",
					artist: "Elton John",
					name: "Tiny Dance",
					id: 1,
				},
				{
					album: "Honky Chateau",
					artist: "Elton John",
					name: "Rocket Man",
					id: 2,
				},
				{
					album: "Sleeping With The Past",
					artist: "Elton John",
					name: "Sacrifice",
					id: 3,
				},
			],
			playlistName: "New Elton John Playlist",
			playlistTracks: [
				{
					album: "Madman Across The Water",
					artist: "Elton John",
					name: "Tiny Dance",
					id: 1,
				},
				{
					album: "Honky Chateau",
					artist: "Elton John",
					name: "Rocket Man",
					id: 2,
				},
				{
					album: "Sleeping With The Past",
					artist: "Elton John",
					name: "Sacrifice",
					id: 3,
				},
			],
			userPlaylists: [
				{
					description: "Music for working in the wood shop",
					name: "Woodworking Music",
					tracks: {
						tracks: [
							{
								artist: "ArtistName1",
								album: "AlbumName1",
								name: "SongName1",
							},
							{
								artist: "ArtistName2",
								album: "AlbumName2",
								name: "SongName2",
							},

							{
								artist: "ArtistName3",
								album: "AlbumName3",
								name: "SongName3",
							},
						],
						href: "mock",
						total: 178,
					},
					uri: "spotify:playlist:56rGRM0LeZwB2QGS8MmrEu",
				},
				{
					description: "Peaceful and relaxing nature sounds to soothe the soul",
					name: "Nature Sounds",
					tracks: {
						tracks: [
							{
								artist: "ArtistName4",
								album: "AlbumName4",
								name: "SongName4",
							},
							{
								artist: "ArtistName5",
								album: "AlbumName5",
								name: "SongName5",
							},

							{
								artist: "ArtistName6",
								album: "AlbumName6",
								name: "SongName6",
							},
						],
						href: "mock",
						total: 85,
					},
					uri: "spotify:playlist:56rGRM0LeZwB2QGS8MmrEu",
				},
				{
					description: "Focusing and Study music",
					name: "Deep Focus",
					tracks: {
						tracks: [
							{
								artist: "ArtistName7",
								album: "AlbumName7",
								name: "SongName7",
							},
							{
								artist: "ArtistName8",
								album: "AlbumName8",
								name: "SongName8",
							},

							{
								artist: "ArtistName9",
								album: "AlbumName9",
								name: "SongName9",
							},
						],
						href: "mock",
						total: 203,
					},
					uri: "spotify:playlist:56rGRM0LeZwB2QGS8MmrEu",
				},
			],
			activeTrack: "spotify:track:2fzp6ojPHvZaz4uHXxpJVk",
			activeTrackInfo: {
				name: "Bartholomew",
				artist: "The Silent Comedy",
				album: "Common Faults",
			},
			playerConnected: true,
			playing: false,
			createNew: true,
			auth: true,
			isMock: true,
		});
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
		if (sessionStorage.getItem("isMock") === "true") {
			const userPlaylists = this.state.userPlaylists;
			userPlaylists.push({
				description: "New SpotOn Playlist",
				name: this.state.playlistName,
				tracks: {
					tracks: this.state.playlistTracks,
					total: this.state.playlistTracks.length,
				},
			});
			this.setState({ playlistName: "New Playlist", playlistTracks: [] });
			document.querySelector(".Playlists").scrollIntoView();
		}
		const trackURIs = this.state.playlistTracks.map((track) => track.uri);
		Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
			this.setState({ playlistName: "New Playlist", playlistTracks: [] });
			this.listPlaylists();
			document.querySelector(".Playlists").scrollIntoView();
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
		Spotify.getPlaylists().then((playlists) => {
			console.log(playlists);
			this.setState({ userPlaylists: playlists });
		});
	}
	deletePlaylist(playlistId) {
		if (this.state.isMock)
			this.setState({
				userPlaylists: this.state.userPlaylists.filter(
					(playlist) => playlist.name !== playlistId
				),
			});
		document.querySelector(".Playlists").scrollIntoView();
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
		if (!document.cookie.match(/SpotifyAuth=true/)) return;
		if (window.location.href.match(/error=access_denied/))
			sessionStorage.setItem("AcceptsSpotify", "false");
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
		if (
			prevState.activeTrack !== this.state.activeTrack &&
			!this.state.isMock
		) {
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
			<div>
				<h1>
					Spot<span className="highlight"> On! </span>
				</h1>
				{this.state.isMock && (
					<p
						className="exit"
						onClick={() => {
							sessionStorage.setItem("isMock", "false");
							window.location = window.location.origin + "?error=access_denied";
						}}>
						Mock Version for layout, most buttons wont work. Click here to exit.
					</p>
				)}

				<div
					className={
						this.state.isMock && this.state.playerConnected
							? "mockApp"
							: "realApp"
					}>
					<Player
						isMock={this.state.isMock}
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
							isMock={this.state.isMock}
							generateMockData={this.generateMockData}
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
						<SearchBar onSearch={this.search} isMock={this.state.isMock} />
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
			</div>
		);
	}
}

export default App;
