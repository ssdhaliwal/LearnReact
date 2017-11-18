# LearnReact
My examples for learning react

TicTacToe
- This is a modified example from ReactJS website.  Trying to get the child component to register a callback function with the parent using "registerCallbacks".
- A major change is that I would like Board to be in control of the game and Game track the history and recovery (but Board perform the recovery and update the Game when done).

TicTacToe v2
- separated game, board, and square classes
- has callbacks registered from board to game
- dynamic grid size
	- game state is updated
	- board is redrawn
		- line matching array is updated
		- calculation of winner is done via loops
		- reduced calling of winner calculation to one
	- highlighting works