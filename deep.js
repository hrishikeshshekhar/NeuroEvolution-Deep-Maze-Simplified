//Variables for canvas
var canvas = document.querySelector('canvas');
var c      = canvas.getContext('2d');

//A variable for keeping track of the population size
const total = 100;

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

//Variable to store training data
var training_data = [];
var training_inputs = [];

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
  dirs           = [];
  nowalls        = 10;
  wallpoint      = nowalls - 1;
  generation     = 1;
  speed          = -3;
  maxspeed       = -10;
  acc            = 0.2;
  minspacing     = 200;
  maxspacing     = 300;
  framecount     = 5;
  score          = 0;

  //Creating players
  for(var i = 0; i < total; ++i)
  {
    //Initializing the players
    var player = new Player(width / 5, i);

    //Setting up players
    player.setup();

    //Pushing player to the players array
    players.push(player);
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
  if (score % 100 < -speed)
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
      killed.reward += score;
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

    //Checking if it is clicked on the restart button
    if( (x > width / 2 - 100) && (x < width / 2 + 100) && (y > height / 2) && (y < height / 2 + 100) )
    {
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
  c.fillText('Best Score: ' + Math.floor(score), width / 2 - 140, height / 2 - 100);

  //Creating a restart button
  c.fillStyle = "rgb(0, 120, 255)";
  c.fillRect(width / 2 - 100, height / 2, 200, 100);

  //Restarting text
  c.font = "27px Georgia";
  c.fillStyle = "rgb(255, 0, 120)";
  c.fillText("Start Next Gen", width / 2 - 80, height / 2 + 60);
}

//Loading the images
function loadimages()
{
  ninjarun.src    = 'NinjaRun.png';
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
  savedplayers   = [];
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
      var wall = new Wall(players[0].x + minspacing + (maxspacing - minspacing) * Math.random());

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
    var leastdist = 100000;
    var leastindex = -1;

    //Finding closest wall after
    for(var i = 0; i < walls.length; ++i)
    {
      if(walls[i].x > players[j].x && walls[i].x < leastdist)
      {
        leastdist = walls[i].x - players[j].x;
        leastindex = i;
      }
    }

    closestwall = walls[leastindex];

    //The distance from a wall's top opening
    let top, input;
    for(var i = 0; i < closestwall.open.length; ++i)
    {
      if(closestwall.open[i] === true)
      {
        top = closestwall.scale * i;
        input = (top - players[j].y) / height;
      }
    }

    var outputs = players[j].brain.predict([input]);

    //Making the brain think
    var largest = outputs[0];
    var largestindex = 0;

    //Finding the maximum output
    for(var i = 1; i < outputs.length; ++i)
    {
      if(outputs[i] > largest)
      {
        largest = outputs[i];
        largestindex = i;
      }
    }

    dirs[j] = largestindex;
  }
}

//Function to create the next Generation
function createNextGen()
{
  //Normalizing the rewards
  var sum = 0;
  let rewards = [];
  stop  = true;
  var smallest = savedplayers[0].reward;

  //Finding the smallest reward and adding it to all the rewards to make it positive
  for(var i = 0; i < savedplayers.length; ++i)
  {
    sum += savedplayers[i].reward;
  }

  console.log(sum, total);
  console.log('Average rewards: ', sum / total);

  //If all the players do the same thing and thier scores are negative
  if(sum === 0)
  {
    sum = 1;
  }

  for(var i = 0; i < savedplayers.length; ++i)
  {
    savedplayers[i].reward /= sum;
    rewards.push(savedplayers[i].reward);
  }

  //Picking parents for crossover
  for(var i = 0; i < total; ++i)
  {
    var parent1 = pickparent(rewards);
    var parent2 = pickparent(rewards);
    var child   = Nn.crossover(parent1, parent2);
    child.mutate(0.1);

    savedplayers[i].brain = child;
  }

  speed = 0;

  //Setting the players to saved players
  players = savedplayers;

  //Calling dialog for next gen every 10 generations
  dialogfornextgen();
}

//Function to pick parents
function pickparent(rewards)
{
  // //Finding best 25% parents
  // var bestrewards = [];
  // let copyrewards = rewards.slice(0, rewards.length);
  // var bestrewardsindex = [];
  // var nobest = Math.floor(rewards.length / 4);
  //
  // for(var i = 0; i < nobest; ++i)
  // {
  //   var best = copyrewards[0];
  //   var bestindex = 0;
  //
  //   for(var j = 0; j < copyrewards.length; ++j)
  //   {
  //     if(copyrewards[j] >= best)
  //     {
  //       best = copyrewards[j];
  //       bestindex = j;
  //     }
  //   }
  //
  //   bestrewards.push(best);
  //   bestrewardsindex.push(bestindex);
  //   copyrewards[bestindex] = -10000000;
  // }

  //A variavle to see if the player to mutate has been found
  var found = false;
  var tries = 0;

  while(found === false && tries < 10000)
  {
    var index = Math.floor(Math.random() * rewards.length);
    var prob  = Math.random();

    if(prob < rewards[index])
    {
      return savedplayers[index].brain;
    }
    else
    {
      ++tries;
    }
  }
}
