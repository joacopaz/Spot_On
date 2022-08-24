import makeId from "./Encoder";
let accessToken;
let searchTerm;
if (!sessionStorage.getItem("state")) {
	sessionStorage.setItem("state", makeId(24));
}
const clientId = "752142ca66624fbaa14aae32426abfcc";
// const redirectURI = "http://localhost:3000/";
const redirectURI = "https://spot0n.surge.sh/";
const Spotify = {
	getAccessToken() {
		if (accessToken) return accessToken;
		// check for access token match
		const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
		const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
		const stateMatch = window.location.href.match(/state=([^&]*)/);
		if (
			accessTokenMatch &&
			expiresInMatch &&
			stateMatch[1] === sessionStorage.getItem("state")
		) {
			accessToken = accessTokenMatch[1];
			const expiresIn = Number(expiresInMatch[1]);
			// This clears the parameters, allowing us to grab a new access token when it expires.
			window.setTimeout(() => {
				accessToken = "";
				sessionStorage.setItem("auth", false);
			}, expiresIn * 1000);
			window.history.pushState("Access Token", null, "/");
			return accessToken;
		} else {
			const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-read-collaborative%20playlist-modify-public%20playlist-read-private%20playlist-modify-private streaming%20user-read-email user-read-private%20user-read-playback-state&redirect_uri=${redirectURI}&state=${sessionStorage.getItem(
				"state"
			)}`;
			if (document.querySelector(".SearchBar input")) {
				searchTerm = document.querySelector(".SearchBar input").value;
				sessionStorage.setItem("search", searchTerm);
				sessionStorage.setItem("auth", true);
				window.location = accessUrl;
			}
		}
	},
	async search(term) {
		const accessToken = Spotify.getAccessToken();
		const url = "https://api.spotify.com/v1";
		const endpoint = "/search?type=track&q=";
		const request = url + endpoint + term;
		const response = await fetch(request, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		const jsonResponse = await response.json();
		if (!jsonResponse.tracks) {
			return [];
		}
		return jsonResponse.tracks.items.map((track) => ({
			id: track.id,
			name: track.name,
			artist: track.artists[0].name,
			album: track.album.name,
			uri: track.uri,
		}));
	},
	async getPlaylists() {
		const accessToken = Spotify.getAccessToken();
		const headers = { Authorization: `Bearer ${accessToken}` };
		let userId;
		const response = await fetch("https://api.spotify.com/v1/me", {
			headers: headers,
		});
		const jsonResponse = await response.json();
		userId = jsonResponse.id;
		const playlistResponse = await fetch(
			`https://api.spotify.com/v1/users/${userId}/playlists`,
			{
				headers: headers,
			}
		);
		const playlistsJson = await playlistResponse.json();
		if (!playlistsJson.items) return;
		return playlistsJson.items;
	},
	savePlaylist(name, trackUris, description) {
		if (!name || !trackUris.length) return;
		const accessToken = Spotify.getAccessToken();
		const headers = { Authorization: `Bearer ${accessToken}` };
		let userId;
		return fetch("https://api.spotify.com/v1/me", { headers: headers })
			.then((response) => {
				return response.json();
			})
			.then((jsonResponse) => {
				userId = jsonResponse.id;
				let request;
				if (description) {
					request = fetch(
						`https://api.spotify.com/v1/users/${userId}/playlists`,
						{
							headers: headers,
							method: "POST",
							body: JSON.stringify({ name: name, description: description }),
						}
					);
				} else {
					request = fetch(
						`https://api.spotify.com/v1/users/${userId}/playlists`,
						{
							headers: headers,
							method: "POST",
							body: JSON.stringify({ name: name }),
						}
					);
				}
				request
					.then((response) => response.json())
					.then((jsonResponse) => {
						const playlistId = jsonResponse.id;
						return fetch(
							`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
							{
								headers: headers,
								method: "POST",
								body: JSON.stringify({ uris: trackUris }),
							}
						);
					});
			});
	},
	async fetchTracks(href) {
		const tracks = [];
		const accessToken = Spotify.getAccessToken();
		const headers = { Authorization: `Bearer ${accessToken}` };
		const response = await fetch(href, { headers: headers });
		let jsonResponse = await response.json();
		const items = jsonResponse.items;

		while (jsonResponse.next) {
			const newResponse = await fetch(jsonResponse.next, { headers: headers });
			jsonResponse = await newResponse.json();
			jsonResponse.items.forEach((item) => items.push(item));
		}
		items.forEach((item) => {
			if (!tracks.some((storedTrack) => storedTrack.id === item.track.id)) {
				tracks.push(item.track);
			}
		});
		return tracks.map((track) => {
			return {
				id: track.id,
				name: track.name,
				artist: track.artists[0].name,
				album: track.album.name,
				uri: track.uri,
			};
		});
	},
	async connectPlayer(player) {
		const accessToken = await Spotify.getAccessToken();
		const headers = { Authorization: `Bearer ${accessToken}` };
		try {
			return await fetch(`https://api.spotify.com/v1/me/player`, {
				headers: headers,
				method: "PUT",
				body: JSON.stringify({ device_ids: [player] }),
			});
		} catch (error) {
			console.log(error);
		}
	},
	async playSongs(deviceId, uris, context) {
		const accessToken = await Spotify.getAccessToken();
		const headers = { Authorization: `Bearer ${accessToken}` };
		let body;
		let contextUri;
		if (context) {
			contextUri = context.uri;
			body = JSON.stringify({
				context_uri: contextUri,
				offset: { uri: uris },
			});
		} else if (uris) {
			body = JSON.stringify({
				uris: [uris],
			});
		} else {
			body = JSON.stringify({});
		}
		try {
			return await fetch(
				`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
				{
					headers: headers,
					method: "PUT",
					body: body,
				}
			);
		} catch (error) {
			console.log(error);
		}
	},
	async deletePlaylist(playlistId) {
		const accessToken = await Spotify.getAccessToken();
		const headers = { Authorization: `Bearer ${accessToken}` };
		const request = await fetch(
			`https://api.spotify.com/v1/playlists/${playlistId}/followers`,
			{ headers: headers, method: "DELETE" }
		);
		return request;
	},
	async stopSong(deviceId) {
		const accessToken = await Spotify.getAccessToken();
		const headers = { Authorization: `Bearer ${accessToken}` };
		const request = await fetch(
			`https://api.spotify.com/v1/me/player/pause?${deviceId}`,
			{ headers: headers, method: "PUT" }
		);
		return request;
	},
	async setVolume(percentage, deviceId) {
		const accessToken = await Spotify.getAccessToken();
		const headers = { Authorization: `Bearer ${accessToken}` };
		const request = await fetch(
			`https://api.spotify.com/v1/me/player/volume?volume_percent=${percentage}&device_id=${deviceId}`,
			{ headers: headers, method: "PUT" }
		);
		return request;
	},
	async fetchTrackInfo(trackUri) {
		const accessToken = Spotify.getAccessToken();
		const headers = { Authorization: `Bearer ${accessToken}` };
		const id = trackUri.match(/track:([^&]*)/)[1];
		const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
			headers: headers,
		});
		const jsonResponse = await response.json();
		return jsonResponse;
	},
};

export default Spotify;
