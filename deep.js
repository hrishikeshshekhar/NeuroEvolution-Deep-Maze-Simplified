//Variables for canvas
var canvas = document.querySelector('canvas');
var c      = canvas.getContext('2d');

//Setting canvas height and width
canvas.width  = 800;
canvas.height = 600;

var width = canvas.width;
var height = canvas.height;

//Speed or difficulty
var speed    = -3;
var maxspeed = -10;
var score    = 0;
var acc      = 0.2;

//Variables for the players
var players = [];
var lifes = [];

//A variable for keeping track of the population size
const total = 10;

//Variable for the walls
var walls      = [];
var nowalls    = 10;
var wallpoint  = nowalls - 1;
var minspacing = 200;
var maxspacing = 300;
var brains = [];
var dirs   = [];
//Variable to hold mouse positon
var mouse = { x : 0, y: 0};

//Variable for when to update the sprite
var framecount = 3;

//Variables for images
var ninjarun    = new Image();
var background  = new Image();
var ninjadie    = new Image();
var sky         = new Image();

//Adding eventlistner for mouse movement
document.addEventListener("mousemove", mousemoved);
document.addEventListener("mousedown", mouseclick);

//Function to initialize all Variables
function setup()
{
  //Loading images
  loadimages();

  //Creating a neural networks
  for(var i = 0; i < total; ++i)
  {
    brains[i] = new Nn(4, 4, 2);
    brains[i].setup();
  }

  //Starting game
  restart();
}

function draw()
{
  //Clearing screen
  c.clearRect(0, 0, width, height);

  //Drawing a border
  c.fillStyle = 'rgb(255, 0, 120)';
  c.fillRect(0, 0, width, height);

  //Drawing a black background
  c.fillStyle = 'rgb(0, 0, 0)';
  c.drawImage(background, 0, 10);

  //Drawing the walls
  for(var i = 0; i < walls.length; ++i)
  {
    walls[i].draw();
  }

  //Drawing the player
  for(var i = 0; i < total; ++i)
  {
    players[i].draw();
  }

  //Displaying the score
  c.font      = "20px Georgia";
  c.fillStyle = "rgb(255, 0, 255)";
  c.fillText('Score: ' + Math.floor(score), width - 130, 50);

  //Displaying player's health
  c.font      = "20px Georgia";
  c.fillStyle = "rgb(255, 0, 255)";
  c.fillText('Health: ' + Math.floor(players[0].health), 100, 50);


  //Checking whether the user has crashed
  check();

  //Updating all values
  update();

  requestAnimationFrame(draw);
}

//Updates all values
function update()
{
  //Increasing the score
  score  -= speed;

  //Increasing the speed every 1000
  if (score % 1000 < -speed)
  {
    //Increasing the speed every 1000
    speed -= acc;

    //Limiting the maximum speed
    if(speed < maxspeed)
    {
      speed = maxspeed;
    }
  }

  //Updating the walls
  for(var i = 0; i < walls.length; ++i)
  {
    walls[i].update();
  }

  think();

  for(var j = 0; j < total; ++j)
  {
    // //Updating player 1
    players[j].update(dirs[j]);

    //Updating the frame
    players[j].framechange();
  }
}

//Function to be called when mouse is moved
function mousemoved(event)
{
  mouse.x = event.x;
  mouse.y = event.y;
}

//Function to check if the user has collided with the wall and also remove walls that have gone off the screen
function check()
{
  for(var j = 0; j < total; ++j)
  {
    //Iterating throught all the walls
    for(var i = 0; i < walls.length; ++i)
    {
      //Checking if the sprite goes off the screen
      if(players[j].x < 0)
      {
        //Making the ninja do the dying action
        players[j].action = 2;
        players[j].frame  = 0;
        break;
      }

      //If it hits the right side of the wall
      else if( (players[j].x + players[j].dwidth >= walls[i].x) && (players[j].x + players[j].dwidth <= walls[i].x - speed) )
      {
        //Finding the index of the top part of the user
        var index1 = Math.floor( (players[j].y) / walls[i].scale );

        //Finding the index for the bottom part of the user
        var index2 = Math.floor( (players[j].y + players[j].dheight) / walls[i].scale );

        //If the user hits the right wall
        if( (walls[i].open[index1] === false) || (walls[i].open[index2] === false) )
        {
          //Resetting it's position back to the left of it
          players[j].x = walls[i].x - players[j].dwidth;
        }
      }

      //If the wall went off the screen, wall is pushed back to the back with different characteristics
      if(walls[i].x + walls[i].width < 0)
      {
        //Making this wall 200 pixels after the last wall
        var xval = walls[wallpoint].x + minspacing + Math.random() * (maxspacing - minspacing);
        walls[i].x = xval;

        //Incrementing the wallpointer to point at the wall at the last
        ++wallpoint;

        if(wallpoint === nowalls)
        {
          wallpoint = 0;
        }

        //Changing it's characteristics again
        walls[i].setup();
        walls[i].choose();
      }
    }
  }
}

//Function called when game is over
function gameover()
{
  c.clearRect(0, 0, width, height);

  //Drawing a sky background
  c.drawImage(sky, 0, 0);

  //Displaying the score
  c.font = "50px Georgia";
  c.fillStyle = "rgb(255, 255, 255)";
  c.fillText('Score: ' + Math.floor(score), width / 2 - 80, height / 2 - 100);

  //Creating a restart button
  c.fillStyle = "rgb(0, 120, 255)";
  c.fillRect(width / 2 - 100, height / 2, 200, 100);

  //Restarting text
  c.font = "40px Georgia";
  c.fillStyle = "rgb(255, 0, 120)";
  c.fillText("Restart", width / 2 - 80, height / 2 + 60);
}

//Function called when mouse is clicked
function mouseclick(event)
{
  var x = event.x;
  var y = event.y;

  //Game over menu
  if(life === false)
  {
    //Checking if it is clicked on the restart button
    if( (x > width / 2 - 100) && (x < width / 2 + 100) && (y > height / 2) && (y < height / 2 + 100) )
    {
      //Calling setup to start the game again
      restart();
    }

  }
}

//Loading the images
function loadimages()
{
  ninjarun.src    = 'NinjaRun.png';
  ninjadie.src    = 'NinjaDead.png';
  sky.src         = 'sky.jpg';
  background.src  = 'background.jpg';

  ninjarun.onload = function()
  {
    console.log('Image loaded');
  }
  background.onload = function()
  {
    console.log('Image loaded');
  }
  ninjadie.onload = function()
  {
    console.log('Image loaded');
  }
  sky.onload = function()
  {
    console.log('Image loaded');
  }
}

//Function to restart game
function restart()
{
  //Initializing the variables
  speed          = -5;
  lifes          = [];
  walls          = [];
  score          = 0;
  wallpoint      = nowalls - 1;
  var xval;

  //Creating Deeps
  for(var i = 0; i < total; ++i)
  {
    //Initializing the players
    players[i] = new Player(width / 5, 100);

    //Setting up players
    players[i].setup();
  }

  //Creating the walls
  for(var i = 0; i < nowalls; ++i)
  {
    //When creating the first wall
    if(i === 0)
    {
      //Creating a new wall
      var wall = new Wall(width * 0.75);

      //Setting up the wall
      wall.setup();
      wall.choose();

      //Pushing it into the walls array
      walls.push(wall);
    }

    //For all the subsequent walls
    else
    {
      //Creating a new wall 200 pixels after the previous one
      xval     = walls[i - 1].x + minspacing + Math.random() * (maxspacing - minspacing);
      var wall = new Wall(xval);

      //Setting up the wall
      wall.setup();
      wall.choose();

      //Pushing the wall to the walls array
      walls.push(wall);
    }
  }

  //Caliing draw
  draw();
}

//Function to predict the best direction
function think()
{
  for(var j = 0; j < total; ++j)
  {
    var closestwall;

    //Finding closest wall after
    for(var i = 0; i < walls.length; ++i)
    {
      if(walls[i].x > players[j].x)
      {
        closestwall = walls[i];
        break;
      }
    }

    //Height of person
    let input1 = players[j].y / height;

    //The horizontal distance from a wall
    let input2 = (closestwall.x - players[j].x) / width;

    //The distance from a wall's top opening
    let input3, input4;
    for(var i = 0; i < closestwall.open.length; ++i)
    {
      if(closestwall.open[i] === true)
      {
        input3 = closestwall.scale * i / height;
        input4 = input3 + closestwall.scale / height;
      }
    }

    var inputs = [input1, input2, input3, input4];

    //Making the brain think
    var outputs = brains[j].predict(inputs);

    if(outputs[0] > outputs[1])
    {
      dirs[j] = 0;
    }
    else
    {
      dirs[j] = 1;
    }
  }
}
