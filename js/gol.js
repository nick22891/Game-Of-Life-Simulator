
var counter = 0;//number of times the game has iterated

var population = 0;//population counter

var gridToggle = true;

var c = document.getElementById("gameboard");

var ctx = c.getContext("2d");

ctx.fillStyle = "#FFCCCC";

function BlockGrid (w, h) {

	this.width = w;
	
	this.height = h;
	
	this.grid = new Array();//this stores the current state of the game board
	
	this.bufferGrid = new Array();//this will temporarily store the state of each new iteration
	
	for (var row = 0; row < this.height;row++) { //initializes an array for each row based on the height given
	
		this.grid[row] = [];
		
		for (var col = 0; col < this.width;col++) { //sets the column index for each row based on the width given
		
			this.grid[row][col] = false; //every grid square defaults to false
		
		}
		
	} 
	
    this.toggle = function(row, col) {
        this.grid[row][col] = !this.grid[row][col];//this switches the state of the square passed into the function based on the row and column
    }
    
    this.output = function() {//this function lets me draw all the living boxes by traversing the matrix

    	population = 0;//reset population to zero to calculate it again for this iteration

		ctx.clearRect(0,0,c.width, c.height);
    
    	for (var row = 0; row < this.height;row++) {
		
			for (var col = 0; col < this.width;col++) {

				if (this.grid[row][col]) {

					drawLivingBox(row, col);//draw the box for this location on the grid

					population++;

				}

				if (gridToggle) drawEmptyBox(row,col);//draws a gray square outline in each slot to keep a complete gray grid on the game board. The lines could be drawn more efficiently if the size of the board was to remain constant but I want to keep the ability to adjust the size by simply editing the array size and the canvas size.

			}
		
		} 
    
    }
    
    this.checkIfSquareIsAlive = function (row, col) {
    
    	var alive = false;//sets state to dead until life can be determined
    
    	if (row >= 0 && row < this.height && col < this.width && col >= 0) { //check that this square is not off the map
    	
    		alive = this.grid[row][col];
    	
    	}
    	
    	return alive;
    
    }
    
    this.run = function () {
    
    	for (var row = 0; row < this.height;row++) { //initializes an array for each row based on the height given
	
			this.bufferGrid[row] = [];
		
			for (var col = 0; col < this.width;col++) { //sets the column index for each row based on the width given
			
				var liveAdjacentSquares = 0;//Will accumulate the number of live adjacent squares
				
				for (var r = row-1; r <= row+1; r++) {//this little bit of sorcery will scan the 3x3 grid surrounding the square
				
					for (var c = col-1; c <= col+1;c++) {//hopefully this isn't too confusing - it starts at the top left and scans each row
				
						if (row != r || col != c) {//quickly check that we're not counting the square we're on since right now we only want the 8 surrounding cells
						
							if (this.checkIfSquareIsAlive(r, c)) liveAdjacentSquares++;
						
						}
				
					}
				
				}
				
				if (this.grid[row][col]) {//if this square is alive
				
					if (liveAdjacentSquares < 2 || liveAdjacentSquares > 3) this.bufferGrid[row][col] = false;//this square dies
					
					else this.bufferGrid[row][col] = true;//this square lives
				
				}
				
				else {//if this square is dead
				
					if (liveAdjacentSquares == 3) this.bufferGrid[row][col] = true;//this square becomes a live cell
					
					else this.bufferGrid[row][col] = false;//it stays dead
				
				}
		
			}
		
		} 
  
  		this.grid = this.bufferGrid.slice();
  
    }

}

var grid = new BlockGrid(30, 40); //create a 20 x 20 grid

grid.output();//render the grid

c.addEventListener('click', function(evt) {//this listens for mouseclicks on the grid and toggles the boxes accordingly by calculating the relevant row and column

		y = evt.clientY + window.scrollY;//adjust for any window scrolling

        var row_selected = Math.floor(y / 20);
        var col_selected = Math.floor(evt.clientX / 20);
        grid.toggle(col_selected, row_selected);
        grid.output();
      }, false);

var gameloop = null;//creating a variable for the game loop

function startGame () {

	gameloop = setInterval(function () {

		grid.output();

		grid.run();

		counter++;

		$("#iteration_counter").text("Iterations : " + counter);

		$("#population_counter").text("Population : " + population);

	}, 250);//the game processes an iteration every 0.5 seconds

}

function stopGame () {

	clearInterval(gameloop);//stops the game loop

}

function drawLivingBox (row, col) {//this function is called by the BlockGrid class to draw each living box

	var startX = row * 20;

	var startY = col * 20;

	ctx.fillStyle = "#DD5555";

	ctx.fillRect(startX,startY,19,19);

}

function drawEmptyBox (row,col) {//used to maintain the grid layout with a gray outline for each square

	var startX = row * 20;

	var startY = col * 20;

	ctx.lineWidth=0.5;

	ctx.fillStyle = "101010";

	ctx.strokeRect(startX,startY,20,20);

}

function toggleGridFunction () {

	gridToggle = !gridToggle;

	grid.output();

}
