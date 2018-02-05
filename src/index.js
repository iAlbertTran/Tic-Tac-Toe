import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

	renderSquare(i) {
	    return (
	      <Square key={i}
	        value={this.props.squares[i]}
	        onClick={() => this.props.onClick(i)}
	      />
	    );
	  }

  render() {
    let squareNum = 0;
  
    let board = [];
    for( let i = 0; i < 3; ++i){
      let rows = [];
      for( let j = 0; j < 3; ++j){
        rows.push(this.renderSquare(squareNum));
        ++squareNum;
      }
      board.push(
        <div key={i} className="board-row">{rows}</div>
      );
    }
  
    return (
      <div>
        {board[0]}
        {board[1]}
        {board[2]}
      </div>);
  }
}

class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      moveOrder: Array(9).fill(null),
      ascendingOrder: true,
    };
  }

  jumpTo(step){

  	this.setState({
  		stepNumber: step,
  		xIsNext: (step % 2) === 0,
  	})
  }

  sortBy(){
    this.setState({
      ascendingOrder: !this.state.ascendingOrder,
    });
  }


  handleClick(i){
  	const history = this.state.history.slice(0, this.state.stepNumber + 1);
  	const current = history[history.length - 1];
  	const squares = current.squares.slice();
  	const move = moveLocation(i);

  	let moveOrder = this.state.moveOrder.slice();
  	moveOrder[this.state.stepNumber] = move;

    if(calculateWinner(squares) || squares[i]){
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({

      history: history.concat([{
      	squares: squares
      }]),

      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      moveOrder: moveOrder,
    });

  }


  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const order = this.state.ascendingOrder;

    const start = <button onClick={() => this.jumpTo(0)}>Go to game start</button>;

    /* Determines whats displayed on sort button*/
    const sort = 
      <button onClick={() => this.sortBy()}>
        {order ? 'Ascending Order' : 'Descending Order'}
      </button>;
    

    let moves = history.map((step, move) => {

    	if(!move)
    		return null;

    	const desc = 'Go to move #' + move + ' (' + this.state.moveOrder[move-1] + ')';

    	return (
    		<li key={move}>
          {/* Bolds the most recent move in move history */}
          {(move === this.state.stepNumber) ? 
    			<button onClick={() => this.jumpTo(move)}><b>{desc}</b></button> :
          <button onClick={() => this.jumpTo(move)}>{desc}</button>}
    		</li>
    	);
    });


    moves = order ? moves : moves.reverse();

    let status;

    const squares = document.getElementsByClassName("square");

    if(winner){

      	status = 'Winner: ' + current.squares[winner[0]] + '!';
        // Highlights winning squares
        for( let j = 0; j < 3; ++j){
          squares[winner[j]].style.backgroundColor = "rgba(140,255,50,1)";

        }
    }
    else if(this.state.stepNumber === 9){
    	status = 'Draw!';
    }
    else{
    	status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

      // Resets squares when going back in history to disable highlighting of winning squares
      for( let i = 0; i < squares.length; ++i){
        squares[i].style.backgroundColor = "white";
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          {status}
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>
            {start}
            {sort}
          </div>
          <div className="player-info">
	          <div>
	  			Player: X
	          	<ol>{moves}</ol>
	          </div>

	          <div>
	          	Player: O
	          	<ol>{moves}</ol>
	          </div>
	      </div>

        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return ([a, b, c]);
    }
  }
  return null;
}

function moveLocation(i){
	let locations = [
		[1,1], 
		[2,1], 
		[3,1], 
		[1,2], 
		[2,2], 
		[3,2], 
		[1,3], 
		[2,3], 
		[3,3],
	];

	return locations[i];
}