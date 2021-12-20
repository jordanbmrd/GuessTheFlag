import React, { Component } from 'react';
import './Game.css';

const stateAnswer = {
	HAS_NOT_PLAYED: 0,
	BAD_ANSWER: 1,
	GOOD_ANSWER: 2
};
const TIME_BETWEEN_GAMES = 3;

class Game extends Component {
	constructor(props) {
		super(props);

		this.state = {
			score: 0,
			timerNewGame: TIME_BETWEEN_GAMES,
			won: stateAnswer.HAS_NOT_PLAYED,
			countries: [],
			inputValue: '',
			mysteryCountry: {}
		}

		this.handleInput = this.handleInput.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		const url = 'https://restcountries.com/v2/all';
		fetch(url)
			.then(data => data.json())
			.then(data => {
				this.setState({countries: Array(4).fill().map(country => data[Math.floor(Math.random() * data.length)])},
					() => {
						// Setting up mystery country
						const random = Math.floor(Math.random() * this.state.countries.length);
						const mysteryCountry = this.state.countries[random];
						
						this.setState({
							timerNewGame: TIME_BETWEEN_GAMES,
							won: stateAnswer.HAS_NOT_PLAYED,
							inputValue: '',
							mysteryCountry
						});
					});
			});
	}

	handleInput(e) {
		const inputValue = e.target.value;
		this.setState({inputValue});
	}

	handleSubmit(e) {
		e.preventDefault();
		const {inputValue, won, mysteryCountry} = this.state;

		if (won === stateAnswer.HAS_NOT_PLAYED || won === stateAnswer.BAD_ANSWER) {
			if (inputValue === mysteryCountry.translations.fr) {
				console.log('Good answer!');
				this.setState(prevState => ({
					score: prevState.score + 1,
					won: stateAnswer.GOOD_ANSWER
				}));

				let newGameInterval = setInterval(() => {
					if (this.state.timerNewGame === 0) {
						this.componentDidMount();
						clearInterval(newGameInterval);
					}
					else {
						this.setState(prevState => ({timerNewGame: prevState.timerNewGame - 1}));
					}
				}, 1000);
			} else {
				console.log('Bad answer!');
				this.setState({won: stateAnswer.BAD_ANSWER});
			}
		}
	}

	render() {
		let {score, won, mysteryCountry} = this.state;
		let view = <div>Chargement...</div>

		// If countries has loaded
		if (this.state.countries && this.state.countries.length > 0) {
			const countries = this.state.countries.map((country, i) => (
				<div key={i}>
					<input id={country.translations.fr}
						   type="radio"
						   name="countryInput"
						   value={country.translations.fr}
						   disabled={won === stateAnswer.GOOD_ANSWER}
						   checked={this.state.inputValue === country.translations.fr}
						   required />
					<label htmlFor={country.translations.fr}>{country.translations.fr}</label>
				</div>
			));
			view = <div>
					{(won === stateAnswer.GOOD_ANSWER) ?
						<p style={{color: 'green'}}>
							GG !<br />
							Le pays était : <b>{mysteryCountry.translations.fr}</b><br />
							Prochain : <b>{this.state.timerNewGame}</b>
						</p> :
						(won === stateAnswer.BAD_ANSWER) ?
							<p style={{color: 'red'}}>
								Mauvaise réponse ! Essaie un autre
							</p> : (null)
					}
					
					<div>
						<form onSubmit={this.handleSubmit}>
							<div className="countryAsking" onChange={this.handleInput}>
								<div className="buttons">
									{countries}
								</div>
								<div className="flag">
									<img src={this.state.mysteryCountry.flag} alt="Flag" />
									<span className="score">
										{score} drapeau{score > 1 ? 'x' : ''} trouvé{score > 1 ? 's' : ''}
									</span>
								</div>
							</div>
							<div className="guessBtn">
								<button type="submit">GUESS</button>
							</div>
						</form>
					</div>
				</div>;
		}

		return (
			<div className="game">
				{view}
			</div>
		);
	}
}

export default Game;
