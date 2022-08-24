import "./SearchResults.css";
import TrackList from "../TrackList/TrackList";
import React from "react";

class SearchResults extends React.Component {
	render() {
		return (
			<div className="SearchResults">
				<h2>Results</h2>
				<TrackList
					tracks={this.props.searchResults}
					playlistTracks={this.props.playlistTracks}
					onAdd={this.props.onAdd}
					isRemoval="no"
					setSong={this.props.setSong}
					stopSong={this.props.stopSong}
					activeTrack={this.props.activeTrack}
					playing={this.props.playing}
					playerConnected={this.props.playerConnected}
					context={false}
					activeTrackName={this.props.activeTrackName}
				/>
			</div>
		);
	}
}

export default SearchResults;
