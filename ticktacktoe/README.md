TickTackToe
- This is a modified example from ReactJS website.  Trying to get the child component to register a callback function with the parent using "registerCallbacks".
- A major change is that I would like Board to be in control of the game and Game track the history and recovery (but Board perform the recovery and update the Game when done).

The current example allows child component to register callbacks with the parent and then the parent can call the callbacks.
- - Game -> send "registerCallbacks" function to Board.
- - Board -> in constructor register the callbacks from Board back to the Game using array of callback functions.
- - Game -> use registered callbacks to execute code within Board.

Please note this was an experiment; but there are times when a parent class needs to manage state and allow child classes to do the work.  This modified example uses Game to manage the state of the board.

Convoluted, but it works!!! working on updating the comments in code :)
