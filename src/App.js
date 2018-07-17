import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

function Header(props) {
  return (
    <div className="header">
      <Stats players={props.players} />
      <h1>{props.title}</h1>
      <Stopwatch />
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  players: PropTypes.array.isRequired,
}

function Player(props) {
  return (
    <div className="player">
      <div className="player-name">
        <a className="remove-player" onClick={props.onRemove}> &times; </a>
        {props.name}
      </div>
      <div className="player-score">
        <Counter score={props.score} onChange={props.onScoreChange} />          
      </div>
    </div>
  );
}

Player.propTypes = {
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  onScoreChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

function Counter(props) {
  return (
    <div className="counter">
      <button className="counter-action decrement" onClick={() => props.onChange(-1)}> - </button>
      <div className="counter-score"> {props.score} </div>
      <button className="counter-action increment" onClick={() => props.onChange(1)}> + </button>
    </div>
  );
}

Counter.propTypes = {
  score: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}

function Stats(props) {
  let totalPlayers = props.players.length;
  let totalPoints = props.players.reduce((total, player) => {
    return total + player.score;
  }, 0) 
  return (
    <table className="stats">
      <tbody>
        <tr>
          <td>Players:</td>
          <td>{totalPlayers}</td>
        </tr>
        <tr>
          <td>Total Points:</td>
          <td>{totalPoints}</td>
        </tr>
      </tbody>
    </table>
  );
}

Stats.propTypes = {
  players: PropTypes.array.isRequired,
}

class AddPlayerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    }
    this.onNameChange = this.onNameChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onNameChange(e) {
    this.setState({name: e.target.value});
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.onAdd(this.state.name);
    this.setState({name: ""})
  }
  render() {
    return (
      <div className="add-player-form">
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.name} onChange={this.onNameChange} />
          <input type="submit" value="Add Player" />
        </form>
      </div>
    );
  }
}

AddPlayerForm.propTypes = {
  onAdd: PropTypes.func.isRequired,
}

class Stopwatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      running: false,
      elapsedTime: 0,
      previousTime: 0,
    }
    this.onTick = this.onTick.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.onReset = this.onReset.bind(this);
  }
  componentDidMount() {
    this.interval = setInterval(this.onTick, 100);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  onTick() {
    if (this.state.running) {
      let now = Date.now();
      this.setState({
        previousTime: now,
        elapsedTime: this.state.elapsedTime + (now - this.state.previousTime),
      })
    }
  }
  onStart() {
    this.setState({
      running: true,
      previousTime: Date.now(),
    });
  }
  onStop() {
    this.setState({running: false});
  }
  onReset() {
    this.setState({
      elapsedTime: 0,
      previousTime: Date.now(),
    })
  }
  render() {    
    let seconds = Math.floor(this.state.elapsedTime / 1000);
    return (
      <div className="stopwatch">
        <h2>Stopwatch</h2>
        <div className="stopwatch-time">{seconds}</div>
        {this.state.running ? <button onClick={this.onStop}>Stop</button> : <button onClick={this.onStart}>Start</button>}
        <button onClick={this.onReset}>Reset</button>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: this.props.initialPlayers,
      nextId: this.props.initialPlayers.length + 1,
    }
    this.onPlayerAdd = this.onPlayerAdd.bind(this);
  }
  onScoreChange(index, delta) {
    let players = this.state.players.slice();
    players[index].score += delta;
    this.setState({players: players});
  }
  onPlayerAdd(name) {
    let players = this.state.players.slice();
    players.push({
      name: name,
      score: 0,
      id: this.state.nextId,    
    });
    this.setState({players: players});
    this.setState({nextId: this.state.nextId + 1})
  }
  onPlayerRemove(index) {
    let players = this.state.players.slice();
    players.splice(index, 1);
    this.setState({players: players});
  }
  render() {
    return (
      <div className="scoreboard">
        <Header title={this.props.title} players={this.state.players} />          
        <div className="players">
          {this.state.players.map((player, index) => {
            return (
              <Player
                name={player.name}
                score={player.score}
                key={player.id}
                onScoreChange={(delta) => {this.onScoreChange(index, delta)}}
                onRemove={() => {this.onPlayerRemove(index)}} />
            )
          })}         
        </div>
        <AddPlayerForm onAdd={this.onPlayerAdd} />
      </div>
    );
  }
}

App.propTypes = {
  title: PropTypes.string,
  initialPlayers: PropTypes.arrayOf(PropTypes.shape({
  name: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  })).isRequired,
};

App.defaultProps = {
  title: 'Scoreboard',
  initialPlayers: [
    {
      name: "Player One",
      score: 0,
      id: 1,
    },
    {
      name: "Player Two",
      score: 0,
      id: 2,
    },
    {
      name: "Player Three",
      score: 0,
      id: 3,
    },
    {
      name: "Player Four",
      score: 0,
      id: 4,
    },
  ]
}

export default App;