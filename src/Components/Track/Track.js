import "./Track.css";
import React from "react";

class Track extends React.Component {
	constructor(props) {
		super(props);
		if (this.props.activeTrack === this.props.track.uri) {
			this.state = { isPlaying: true };
		} else {
			this.state = { isPlaying: "" };
		}

		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	addTrack() {
		// if (sessionStorage.getItem("isMock") === "true") return;
		this.props.onAdd(this.props.track);
	}
	removeTrack() {
		// if (sessionStorage.getItem("isMock") === "true") return;
		this.props.onRemove(this.props.track);
	}
	renderAction() {
		if (this.props.isRemoval === "yes") {
			return (
				<button className="Track-action" onClick={this.removeTrack}>
					-
				</button>
			);
		} else if (this.props.isRemoval === "no") {
			return (
				<button className="Track-action" onClick={this.addTrack}>
					+
				</button>
			);
		}
	}
	async handleClick() {
		if (localStorage.getItem("isMock") === "true") return;
		if (
			this.props.track.name === this.props.activeTrackName.name &&
			this.props.track.artist === this.props.activeTrackName.artist &&
			this.props.track.album === this.props.activeTrackName.album
		) {
			return document.querySelector("#PlayButton").click();
		}
		if (this.props.context) {
			return await this.props.setSong(this.props.track.uri, this.props.context);
		}
		return await this.props.setSong(this.props.track.uri);
	}
	render() {
		const artist = this.props.activeTrackName.artist;
		const name = this.props.activeTrackName.name;
		const album = this.props.activeTrackName.album;
		let found = false;
		if (this.props.playlistTracks) {
			found = this.props.playlistTracks.find((track) => {
				return (
					track.name === this.props.track.name &&
					track.album === this.props.track.album &&
					track.artist === this.props.track.artist
				);
			});
		}
		return (
			<>
				{!found && (
					<div className="Track">
						<div className="Track-information">
							<h3>{this.props.track.name}</h3>
							<p>
								{this.props.track.artist} | {this.props.track.album}
							</p>
						</div>
						{this.renderAction()}
						<button className="Track-action" onClick={this.handleClick}>
							{this.props.playerConnected &&
								(artist !== this.props.track.artist ||
									name !== this.props.track.name ||
									album !== this.props.track.album ||
									!this.props.playing) && <span>&#9654;</span>}
							{artist === this.props.track.artist &&
								name === this.props.track.name &&
								album === this.props.track.album &&
								this.props.playing && (
									<span style={{ fontSize: "0.7rem" }}>&#9611;&#9611;</span>
								)}
						</button>
					</div>
				)}
			</>
		);
	}
}

export default Track;
