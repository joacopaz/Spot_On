import React from "react";
import Track from "../Track/Track";
import "./Playlists.css";

class Playlists extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			auth: this.props.authStatus,
			activePlaylist: "",
			activeTracks: [],
		};
		this.auth = this.auth.bind(this);
		this.handleChangeName = this.handleChangeName.bind(this);
		this.handleChangeDesc = this.handleChangeDesc.bind(this);
	}
	auth() {
		this.props.onClick();
		this.setState({ auth: this.props.authStatus });
	}
	generateContent() {
		return (
			<div className="PlaylistList">
				<ul>
					{this.props.playlists &&
						this.props.playlists.map((playlist) => {
							return (
								<li
									key={playlist.id}
									onClick={async () => {
										this.setState({ activePlaylist: playlist }, async () => {
											const tracks = await this.props.getTracks(
												this.state.activePlaylist.tracks.href
											);
											this.setState({ activeTracks: tracks }, () => {
												document
													.querySelector(".Playlists-info")
													.scrollIntoView();
											});
										});
									}}>
									{playlist.name}
								</li>
							);
						})}
				</ul>
			</div>
		);
	}
	componentDidMount() {
		this.props.onMount();
	}
	handleChangeName(e) {
		const playlistState = this.state.activePlaylist;
		return playlistState;
		// 	this.setState({
		// 		activePlaylist: { ...playlistState, name: e.target.value },
		// 	});
	}
	handleChangeDesc(e) {
		const playlistState = this.state.activePlaylist;
		return playlistState;
		// this.setState({
		// 	activePlaylist: { ...playlistState, description: e.target.value },
		// });
	}

	render() {
		const content = this.generateContent();
		const tracklist = (
			<div className="TrackList">
				{this.state.activeTracks.map((track) => {
					return (
						<Track
							track={track}
							key={track.id}
							setSong={this.props.setSong}
							stopSong={this.props.stopSong}
							context={this.state.activePlaylist}
							setContext={this.props.setContext}
							resetContext={this.props.resetContext}
							activeTrack={this.props.activeTrack}
							playerConnected={this.props.playerConnected}
							playing={this.props.playing}
							activeTrackName={this.props.activeTrackName}
						/>
					);
				})}
			</div>
		);

		return (
			<div className="container-playlists">
				<div className="Playlists">
					{this.state.auth && <h2>Your Playlists</h2>}
					{!this.state.auth && (
						<button className="Authentication" onClick={this.auth}>
							LOG IN
						</button>
					)}
					{this.state.auth && content}
					{this.state.auth && (
						<button
							className="Add"
							onClick={async () => {
								await this.props.awaitSetState({ createNew: true });
								document.querySelector(".SearchBar input").scrollIntoView();
							}}>
							Create New Playlist
						</button>
					)}
				</div>
				{this.state.auth && (
					<div className="Playlists-info">
						{!this.state.activePlaylist && (
							<h2>Select a playlist to view info</h2>
						)}
						{this.state.activePlaylist && (
							<div>
								<input
									value={this.state.activePlaylist.name}
									onChange={this.handleChangeName}></input>

								<textarea
									className="description"
									onChange={this.handleChangeDesc}
									value={this.state.activePlaylist.description}
									placeholder={"No Description"}></textarea>

								{this.state.activeTracks && tracklist}
								<div className="button-container">
									<p>Total tracks: {this.state.activePlaylist.tracks.total}</p>
									<button
										className="Remove"
										onClick={() => {
											if (
												window.confirm(
													`Are you sure you want to delete ${this.state.activePlaylist.name}? This is irreversible.`
												)
											) {
												this.props
													.deletePlaylist(this.state.activePlaylist.id)
													.then(() => {
														this.setState(
															{ activePlaylist: "" },
															this.props.onMount
														);
													});
											}
										}}>
										Delete Playlist
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		);
	}
}

export default Playlists;
