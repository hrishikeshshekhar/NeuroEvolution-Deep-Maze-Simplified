function Wall(x)
{
  this.x         = x;
  this.width     = 20;
  this.scale     = height / 4;
  this.no        = 10;
  this.open      = [];
  this.frametick = 0;

  //Creating the lines
  this.setup = function()
  {
    //Creating an array for the lines
    this.open = new Array(Math.floor(height / this.scale));

    //Initializing all the values to false as initially all the paths are closed
    for(var i = 0; i < this.open.length; ++i)
    {
      this.open[i] = false;
    }
  }

  //Choosing which paths to open
  this.choose = function()
  {
    var i = 0;
    var emptyspaces = 1;
    //Choosing random parts to open
    while(i < emptyspaces)
    {
      //Choosing a random index
      var index = Math.floor(Math.random() * this.open.length);

      //If the index hasn't been picked before, pick it and increase i
      if(this.open[index] === false)
      {
        this.open[index] = true;
        ++i;
      }
    }
  }


  this.draw = function ()
  {
    for(var i = 0; i < this.open.length; ++i)
    {
      //If the path's are closed, draw the paths
      if(this.open[i] === false)
      {
        c.fillStyle = "rgb(255, 0, 120)";
        c.fillRect(this.x , i * this.scale, this.width, this.scale);
      }
    }
  }

  this.update = function ()
  {
    ++this.frametick;

    //Updating the position of the wall
    this.x += speed / framecount;

    if(this.frametick === 1000)
    {
      this.frametick = 0;
    }
  }
}
