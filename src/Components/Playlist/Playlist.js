import "./Playlist.css";
import TrackList from "../TrackList/TrackList";
import React from "react";

class Playlist extends React.Component {
	constructor(props) {
		super(props);
		this.handleNameChange = this.handleNameChange.bind(this);
	}
	handleNameChange(evt) {
		const name = evt.target.value;
		this.props.onNameChange(name);
	}
	render() {
		return (
			<div className="Playlist">
				<input
					value={this.props.playlistName}
					onChange={this.handleNameChange}
				/>
				<TrackList
					tracks={this.props.playlistTracks}
					onRemove={this.props.onRemove}
					isRemoval="yes"
					setSong={this.props.setSong}
					stopSong={this.props.stopSong}
					activeTrack={this.props.activeTrack}
					playing={this.props.playing}
					playerConnected={this.props.playerConnected}
					context={false}
					activeTrackName={this.props.activeTrackName}
				/>
				<button className="Playlist-save" onClick={this.props.onSave}>
					SAVE TO SPOTIFY
				</button>
			</div>
		);
	}
}

export default Playlist;
