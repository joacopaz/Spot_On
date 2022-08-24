import "./SearchBar.css";
import React from "react";

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			term: "",
		};
		this.search = this.search.bind(this);
		this.handleTermChange = this.handleTermChange.bind(this);
	}
	search() {
		this.props.onSearch(this.state.term);
	}
	handleTermChange(evt) {
		this.setState({ term: evt.target.value });
	}
	componentDidMount() {
		if (sessionStorage.getItem("search")) {
			this.setState({ term: sessionStorage.getItem("search") });
			document.querySelector(".SearchBar input").value =
				sessionStorage.getItem("search");
		}
	}
	render() {
		return (
			<div className="SearchBar">
				<input
					placeholder="Enter A Song, Album, or Artist"
					onChange={this.handleTermChange}
				/>
				<button className="SearchButton" onClick={this.search}>
					SEARCH
				</button>
			</div>
		);
	}
}

export default SearchBar;
