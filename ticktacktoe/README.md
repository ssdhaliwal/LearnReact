TickTackToe
- This is a modified example from ReactJS website.  Trying to get the child component to register a callback function with the parent using "registerCallbacks".
- A major change is that I would like Board to be in control of the game and Game track the history and recovery.

The current example will allow child component to register callbacks with the parent and then the parent can call the callbacks.
- - Game -> send "registerCallbacks" function to Board.
- - Board -> in constructor register the callbacks from Board back to the Game using array of callback functions.
- - Game -> use registered callbacks to execute code within Board.

Pending
- update the callbacks to work on the button click and restore the Board.
