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
		this.handleChangeName = this.handleChangeName.bind(this);
		this.handleChangeDesc = this.handleChangeDesc.bind(this);
	}

	generateContent() {
		return (
			<div className="PlaylistList">
				<ul
					style={
						this.props.playlists.length < 1
							? {
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									height: "50%",
							  }
							: {}
					}>
					{this.props.playlists.length < 1 && <li>Loading Playlists...</li>}
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
	componentDidUpdate(prevProps, prevState) {
		if (
			prevProps.authStatus !== this.props.authStatus &&
			this.props.authStatus === true
		) {
			this.setState({ auth: true });
		}
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
				<div
					className="Playlists"
					style={
						!this.state.auth
							? {
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									borderRadius: 30,
									height: "fit-content",
							  }
							: {}
					}>
					{!this.state.auth && (
						<>
							<h3 style={{ margin: "0.8rem", marginTop: "0.5rem" }}>
								Please log into your Spotify Account to use this App.
							</h3>
							<button
								className="Authentication"
								onClick={(e) => {
									e.preventDefault();
									window.location = window.location.origin;
								}}>
								LOG IN
							</button>
							<p
								style={{
									fontSize: "0.9rem",
									margin: "0.8rem",
									textAlign: "justify",
								}}>
								We do not share, store or manipulate any of your Spotify
								information (like user data or email). The app needs
								authorization to allow you to manage your playlists. <br />
								<br />
								Note: Only Spotify premium users may play songs without
								restrictions, non premium users have access to samples with
								potential ads.
							</p>
						</>
					)}
					{this.state.auth && <h2>Your Playlists</h2>}

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
