import "./TrackList.css";
import Track from "../Track/Track";
import React from "react";

class TrackList extends React.Component {
	render() {
		return (
			<div className="TrackList">
				{this.props.tracks &&
					this.props.tracks.map((track, i) => {
						return (
							<Track
								track={track}
								key={track.id ? track.id : i}
								onAdd={this.props.onAdd}
								onRemove={this.props.onRemove}
								isRemoval={this.props.isRemoval}
								setSong={this.props.setSong}
								stopSong={this.props.stopSong}
								playerConnected={this.props.playerConnected}
								context={false}
								activeTrack={this.props.activeTrack}
								playing={this.props.playing}
								activeTrackName={this.props.activeTrackName}
								playlistTracks={
									this.props.playlistTracks ? this.props.playlistTracks : false
								}
							/>
						);
					})}
			</div>
		);
	}
}

export default TrackList;
