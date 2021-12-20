import React, { Component } from 'react';
import Game from './Game';
import './FlagApp.css';

class FlagApp extends Component {
	render() {
		return (
		  <div className="FlagApp">
			  <div>
			    <header style={{backgroundImage: 'url("./bg.jpeg")'}}>
			    	<h1 className="title">Guess The Flag</h1>
			    </header>

			    <Game className="gameComp" />
		      </div>

		      <small>Made with <span style={{ color: "red" }}>❤</span> by Jordan</small>
		  </div>
		);
	}
}

export default FlagApp;
