//Variables for canvas
var canvas = document.querySelector('canvas');
var c      = canvas.getContext('2d');

//A variable for keeping track of the population size
const total = 10;

//Setting canvas height and width
canvas.width  = 800;
canvas.height = 600;

var width = canvas.width;
var height = canvas.height;

//Speed or difficulty
var speed;
var maxspeed;
var score;
var acc;

//Variables for the players
var players;
var savedplayers;
var stop;
var generation;

//Variable for the walls
var walls;
var nowalls;
var wallpoint;
var minspacing;
var maxspacing;
var brains;
var dirs;

//Adding an event listener
document.addEventListener("mousedown", mouseclick);

//Variable for when to update the sprite
var framecount = 3;

//Variables for images
var ninjarun    = new Image();
var background  = new Image();
var ninjadie    = new Image();
var sky         = new Image();

//Function to initialize all Variables
function setup()
{
  //Loading images
  loadimages();

  //Initializing the variables
  stop           = false;
  speed          = -5;
  players        = [];
  savedplayers   = [];
  walls          = [];
  brains         = [];
  dirs           = [];
  nowalls        = 10;
  wallpoint      = nowalls - 1;
  generation     = 1;
  speed          = -3;
  maxspeed       = -10;
  acc            = 0.2;
  minspacing     = 200;
  maxspacing     = 300;
  framecount     = 3;
  score          = 0;

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
  if(stop === false)
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
    for(var i = 0; i < players.length; ++i)
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
    c.fillText('Generation: ' + generation, 100, 50);

    //Checking whether the user has crashed
    check();

    //Updating all values
    update();

    requestAnimationFrame(draw);
  }
}

//Updates all values
function update()
{
  //Increasing the score
  score  -= speed;

  //Increasing the speed every 1000
  if (score % 5000 < -speed)
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

  for(var j = 0; j < players.length; ++j)
  {
    // //Updating player 1
    players[j].update(dirs[j]);

    //Updating the frame
    players[j].framechange();
  }
}

//Function to check if the user has collided with the wall and also remove walls that have gone off the screen
function check()
{
  for(var j = players.length - 1; j >= 0; --j)
  {
    //Checking if the sprite goes off the screen
    if(players[j].x < 0)
    {
      //Removing the player
      var killed = players.splice(j, 1)[0];
      killed.reward = score;
      savedplayers.push(killed);

      //Checking if the game is over
      if(players.length === 0)
      {
        //Updating Generation
        ++generation;
        createNextGen();
      }
    }

    else
    {
      //Iterating throught all the walls
      for(var i = 0; i < walls.length; ++i)
      {
        //If it hits the right side of the wall
        if( (players[j].x + players[j].dwidth >= walls[i].x) && (players[j].x + players[j].dwidth <= walls[i].x - speed) )
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
}

function mouseclick(event)
{
  if(stop === true)
  {
    var x = event.x;
    var y = event.y;
    console.log(x, y);

    //Checking if it is clicked on the restart button
    if( (x > width / 2 - 100) && (x < width / 2 + 100) && (y > height / 2) && (y < height / 2 + 100) )
    {
      console.log('heree');
      //Calling setup to start the game again
      restart();
    }
  }
}

//Function called when game is over
function dialogfornextgen()
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
  c.fillText("Start Next Generation", width / 2 - 80, height / 2 + 60);
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
  score          = 0;
  wallpoint      = nowalls - 1;
  players        = [];
  walls          = [];
  speed = -3;

  //Creating Deeps
  for(var i = 0; i < total; ++i)
  {
    //Initializing the players
    var player = new Player(width / 5, i);

    //Setting up players
    player.setup();

    //Pushing player to the players array
    players.push(player);
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
      var xval = walls[i - 1].x + minspacing + Math.random() * (maxspacing - minspacing);
      var wall = new Wall(xval);

      //Setting up the wall
      wall.setup();
      wall.choose();

      //Pushing the wall to the walls array
      walls.push(wall);
    }
  }


  //Starting game
  stop = false;
  draw();
}

//Function to predict the best direction
function think()
{
  for(var j = 0; j < players.length; ++j)
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

//Function to create the next Generation
function createNextGen()
{
  //Normalizing the rewards
  var sum = 0;
  stop  = true;

  for(var i = 0; i < savedplayers.length; ++i)
  {
    sum += savedplayers[i].reward;
  }

  for(var i = 0; i < savedplayers.length; ++i)
  {
    savedplayers[i].reward /= sum;
  }

  speed = 0;

  //Calling restart
  dialogfornextgen();
}
