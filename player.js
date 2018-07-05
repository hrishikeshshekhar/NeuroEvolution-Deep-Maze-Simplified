function Player(x, y, sprite, index)
{
  //Initialzing player's details
  this.x         = x;
  this.y         = y;
  this.index     = index;
  this.width     = 0;
  this.height    = 0;
  this.frame     = 0;
  this.frametick = 0;
  this.scale     = 1;
  this.dwidth    = 0;
  this.dheight   = 0;
  this.velocity  = 5;
  this.action    = 0;
  this.sprite    = 0;
  this.health    = 0;
  this.life      = true;

  this.setup = function()
  {
    //If sprite is a player
    if(this.sprite === 0)
    {
      this.width   = 373;
      this.height  = 468;
      this.dwidth  = this.width * this.scale / 5;
      this.dheight = this.height * this.scale / 5;
      this.health  = 100;
    }
  }

  this.draw = function ()
  {
    //For a ninja
    if(this.sprite === 0)
    {
      //Running Ninja
      if(this.action === 0)
      {
        c.drawImage(ninjarun, this.frame * this.width , 0, this.width, this.height, this.x, this.y, this.dwidth, this.dheight);
      }

      //If the ninja dies
      else if(this.action === 2)
      {
        c.drawImage(ninjadie, this.frame * 498 , 0, 498, 508, this.x, this.y, this.dwidth, this.dheight);
      }
    }
  }

  //Changes the direction to up if dir is 1 and -1 if dir is -1
  this.update = function (dir)
  {
    //To make it move upward
    if(dir === 1)
    {
      //Updating position with mouse
      this.y -= this.velocity;
    }

    //If it is moving downward
    else
    {
      //Updating the position
      this.y += this.velocity;
    }

    //Checking bottom boundry
    if(this.y + this.dheight > height - 10)
    {
      this.y = height - this.dheight - 10;
    }

    //Checking the top boundry
    else if(this.y < 10)
    {
      this.y = 10;
    }

    //Checking if it shold be allowed to move through the wall
    for(var i = 0; i < walls.length; ++i)
    {
      //If it hits the bottom or top of the wall
      if( (this.x + this.dwidth > walls[i].x - speed) && (this.x < walls[i].x + walls[i].width) )
      {
        //Finding the index of the top part of the user
        var index = Math.floor(this.y / walls[i].scale);

        //If it hits the top wall
        if( (walls[i].open[index] === false) && (this.y < (index + 1) * walls[i].scale) )
        {
          this.y = (index + 1) * walls[index].scale;
        }

        else
        {
          //Finding index of the bottom part of the user
          index = Math.floor( (this.y + this.dheight) / walls[i].scale);

          //Bug - Index goes greater than max index
          if(index >= height / walls[i].scale)
          {
            index = height / walls[i].scale - 1;
          }

          //If it hits the bottom wall
          if( (walls[i].open[index] === false) && ( (this.y + this.dheight) > index * walls[i].scale) )
          {
            this.y = index * walls[index].scale - this.dheight;
          }
        }
      }
    }


    //Creating a parallax
    this.scale =  1.2 * this.y / height;

    //Constraining the scale
    if(this.scale > 1.1)
    {
      this.scale = 1.1;
    }
    else if(this.scale < 0.9)
    {
      this.scale = 0.9;
    }

    //Changing width and height accordingly
    this.dwidth  = this.width * this.scale / 5;
    this.dheight = this.height * this.scale / 5;
  }

  //Changes the frame
  this.framechange = function ()
  {
    //Increasing the frame tick
    this.frametick++;

    //Changing the frame every 10 ticks
    if(this.frametick % framecount === 0)
    {
      ++this.frame;

      //IF the frames are ablove 10, then reset
      if( (this.frame === 10) && (this.sprite === 0) )
      {
        //If the ninja dies
        if(this.action === 2)
        {
          //Killing sprite
          lifes[this.index] = false;

          //Calling game over function
          //gameover();
        }

        this.frame = 0;

      }
    }

    //Reseting the frameticks
    if(this.frametick === 1000)
    {
      this.frametick = 0;
    }
  }
}