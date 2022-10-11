import React from "react";
import "./Player.css";

class Player extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			token: this.props.token,
			activeSong: this.props.song,
			ready: true,
		};
	}

	componentDidMount() {
		if (
			sessionStorage.getItem("isMock" === "true") ||
			!document.cookie.match(/SpotifyAuth=true/)
		)
			return;
		if (
			!document.querySelector('[src="https://sdk.scdn.co/spotify-player.js"]')
		) {
			const script = document.createElement("script");
			script.src = "https://sdk.scdn.co/spotify-player.js";
			script.async = true;
			document.body.appendChild(script);
		}

		// Player handler -----------------------------------------
		window.onSpotifyWebPlaybackSDKReady = () => {
			if (
				sessionStorage.getItem("isMock" === "true") ||
				!document.cookie.match(/SpotifyAuth=true/)
			)
				// You can now initialize Spotify.Player and use the SDK
				console.log("Initialized web player");

			const player = new window.Spotify.Player({
				name: "Spot On!",
				getOAuthToken: (cb) => {
					cb(this.state.token);
				},
				volume: 0.5,
			});

			player.addListener("autoplay_failed", () => {
				console.log("Autoplay is not allowed by the browser autoplay rules");
			});

			player.addListener("ready", ({ device_id }) => {
				player.activateElement();
				console.log("Ready with Device ID", device_id);
				this.setState({ ready: true });

				const listeners = () => {
					document
						.querySelector("#PlayButton")
						.addEventListener("click", () => {
							return player.getCurrentState().then((state) => {
								this.props.updatePlayState(state.paused);
								player.togglePlay();
								// }
							});
						});
					document
						.querySelector("#NextButton")
						.addEventListener("click", () => {
							if (!this.props.context) return alert("Choose a playlist");
							player.nextTrack();
						});
					document
						.querySelector("#PrevButton")
						.addEventListener("click", () => {
							if (!this.props.context) return alert("Choose a playlist");
							player.previousTrack();
						});
					// document
					// 	.querySelector("#NextButton")
					// 	.addEventListener("click", async () => {
					// 		if (this.props.context) {
					// 			const tracks = await this.props.getTracks(
					// 				this.props.context.tracks.href
					// 			);
					// 			const activeTrack = this.props.activeTrackInfo;
					// 			const currentSongI = await new Promise((r) => {
					// 				const track = tracks.findIndex(
					// 					(track) =>
					// 						track.album === activeTrack.album &&
					// 						track.artist === activeTrack.artist &&
					// 						track.name === activeTrack.name
					// 				);
					// 				r(track);
					// 			});
					// 			let nextSongI = currentSongI + 1;
					// 			if (typeof tracks[nextSongI] === "undefined") {
					// 				nextSongI = 0;
					// 			}
					// 			await this.props.setSong(
					// 				tracks[nextSongI].uri,
					// 				this.props.context
					// 			);
					// 		}
					// 	});
					// document
					// 	.querySelector("#PrevButton")
					// 	.addEventListener("click", async () => {
					// 		if (this.props.context) {
					// 			const tracks = await this.props.getTracks(
					// 				this.props.context.tracks.href
					// 			);
					// 			const activeTrack = this.props.activeTrackInfo;
					// 			const currentSongI = await new Promise((r) => {
					// 				const track = tracks.findIndex(
					// 					(track) =>
					// 						track.album === activeTrack.album &&
					// 						track.artist === activeTrack.artist &&
					// 						track.name === activeTrack.name
					// 				);
					// 				r(track);
					// 			});
					// 			let nextSongI = currentSongI - 1;
					// 			if (typeof tracks[nextSongI] === "undefined") {
					// 				nextSongI = tracks.length - 1;
					// 			}
					// 			await this.props.setSong(
					// 				tracks[nextSongI].uri,
					// 				this.props.context
					// 			);
					// 		}
					// 	});
				};

				this.props.setPlayer(device_id, listeners);
			});
			player.addListener(
				"player_state_changed",
				({ track_window: { current_track } }) => {
					this.props.updateTrack(current_track.uri);
					player
						.getCurrentState()
						.then((state) => this.props.updatePlayState(!state.paused));
					if (document.querySelector(".now-playing"))
						document.querySelector(
							".now-playing"
						).textContent = `${current_track.name} - ${current_track.artists[0].name}`;
				}
			);
			player.addListener("player_state_changed", ({ paused }) => {
				// setTimeout(() => {
				// 	if (paused && !this.props.isPaused && this.props.context)
				// 		document.querySelector("#NextButton").click();
				// }, 1000);
			});

			player.addListener("not_ready", ({ device_id }) => {
				console.log("Device ID has gone offline", device_id);
			});

			player.connect();
		};
		// End player handler -----------------------------------------
	}
	render() {
		return (
			<div
				className="playerContainer"
				style={{
					display: !this.props.isMock && !this.props.status && "none",
					bottom: this.props.isMock && "2.8rem",
					transform: this.props.isMock && "translateX(-50.1%)",
				}}>
				<div className="player-left">
					{this.state.ready && (
						<span
							className="now-playing-container"
							style={this.props.status ? {} : { margin: "0.4rem" }}>
							Now Playing:
							<span className="now-playing">
								{this.props.isMock && "Rocketman - Elton John"}
							</span>
						</span>
					)}
				</div>
				<div className="player-controllers">
					<div className="player-buttons">
						{this.state.ready && (
							<button id="PrevButton">
								<span className="innerPrev">&#xab;</span>
							</button>
						)}
						{this.state.ready && (
							<button id="PlayButton">
								{!this.props.isPaused && (
									<span style={{ fontSize: "1rem", paddingLeft: "0.2rem" }}>
										&#9654;
									</span>
								)}
								{this.props.isPaused && (
									<span style={{ fontSize: "0.5rem", paddingLeft: "0.1rem" }}>
										&#9611;&#9611;
									</span>
								)}
							</button>
						)}
						{this.state.ready && (
							<button id="NextButton">
								<span className="innerPrev">&#xbb;</span>
							</button>
						)}
					</div>

					{this.state.ready && (
						<input
							type={"range"}
							className={"volume-bar"}
							min={0}
							max={100}
							step={1}
							defaultValue={50}
							onMouseUp={(e) => {
								if (this.props.isMock) return;
								this.props.setVolume(e.target.value);
							}}
							onTouchEnd={(e) => {
								if (this.props.isMock) return;
								this.props.setVolume(e.target.value);
							}}
							onChange={(e) => {
								e.target.style.backgroundSize = e.target.value + "% 100%";
							}}></input>
					)}
				</div>
				<div className="player-right">
					<div className="attribution">
						Powered by
						<img src={require("./spotifyLogo.png")} alt="Spotify Logo" />
					</div>
				</div>
				{!this.state.ready && <span className="loader">Loading Player...</span>}
			</div>
		);
	}
}
export default Player;
