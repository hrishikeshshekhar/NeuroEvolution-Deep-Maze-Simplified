function Matrix(rows, cols)
{
  this.rows = rows;
  this.cols = cols;
  this.matrix = [];

  //Initializing matrix with random values between 0 and 1
  this.setup = function ()
  {
    for(var i = 0; i < this.rows; ++i)
    {
      var column = [];
      for(var j = 0; j < this.cols; ++j)
      {
        column.push(Math.random());
      }
      this.matrix.push(column);
    }
  }

  //To show matrix in console in a table form
  this.print = function()
  {
    console.table(this.matrix);
  }

  //Function to add 2 martices and return in a third matrix
  //Assuming they have same number of rows and cols
  Matrix.add = function(a, b)
  {
    var result = new Matrix(a.rows, a.cols);
    result.setup();

    for(var i = 0; i < result.rows; ++i)
    {
      for(var j = 0; j < result.cols; ++j)
      {
        result.matrix[i][j] = a.matrix[i][j] + b.matrix[i][j];
      }
    }

    return result;
  }

  Matrix.subtract = function(a, b)
  {
    var result = new Matrix(a.rows, a.cols);
    result.setup();

    for(var i = 0; i < result.rows; ++i)
    {
      for(var j = 0; j < result.cols; ++j)
      {
        result.matrix[i][j] = a.matrix[i][j] - b.matrix[i][j];
      }
    }

    return result;
  }

  Matrix.multiply = function(a, b)
  {
    var result = new Matrix(a.rows, b.cols);
    result.setup();

    for(var i = 0; i < result.rows; ++i)
    {
      for(var j = 0; j < result.cols; ++j)
      {
        result.matrix[i][j] = 0;
        for(var k = 0; k < a.cols; ++k)
        {
          result.matrix[i][j] += (a.matrix[i][k] * b.matrix[k][j]);
        }
      }
    }
    return result;
  }

  this.multiplyscaler = function(n)
  {
    for(var i = 0; i < this.rows; ++i)
    {
      for(var j = 0; j < this.cols; ++j)
      {
        this.matrix[i][j] *= n;
      }
    }
  }

  Matrix.tomatrix = function(array)
  {
    var result = new Matrix(array.length, 1);
    result.setup();

    for(var i = 0; i < array.length; ++i)
    {
      result.matrix[i][0] = array[i];
    }

    return result;
  }

  this.toarray = function()
  {
    var array = [];
    for(var i = 0; i < this.rows; ++i)
    {
      for(var j = 0; j < this.cols; ++j)
      {
        array.push(this.matrix[i][j]);
      }
    }

    return array;
  }

  //Applies the activation function for all the elements of the matrix
  this.activate = function()
  {
    for(var i = 0; i < this.rows; ++i)
    {
      for(var j = 0; j < this.cols; ++j)
      {
        this.matrix[i][j] = Matrix.sigmoid(this.matrix[i][j]);
      }
    }
  }

  //Applies activaton function's deriavate
  this.activateder = function()
  {
    for(var i = 0; i < this.rows; ++i)
    {
      for(var j = 0; j < this.cols; ++j)
      {
        this.matrix[i][j] = this.matrix[i][j] * (1 - this.matrix[i][j]);
      }
    }
  }

  //A function to act as a sigmoid function to conform output to a range
  Matrix.sigmoid = function(number)
  {
    return (1 / (1 + Math.exp(-number)));
  }

  //Function to find sum of all row elements in a row
  this.sumofrow = function(j)
  {
    var sum = 0;
    for(var i = 0; i < this.cols; ++i)
    {
      sum += this.matrix[j][i];
    }
    return sum;
  }

  //Function to transpose the matrix
  Matrix.transpose = function(m)
  {
    var result = new Matrix(m.cols, m.rows);
    result.setup();

    for(var i = 0; i < m.rows; ++i)
    {
      for(var j = 0; j < m.cols; ++j)
      {
        result.matrix[j][i] = m.matrix[i][j];
      }
    }
    return result;
  }

  //A function to perform hadmard product
  Matrix.hadmardproduct = function(a, b)
  {
    var result = new Matrix(a.rows, a.cols);
    result.setup();

    for(let i = 0; i < a.rows; ++i)
    {
      for(let j = 0; j < a.cols; ++j)
      {
        result.matrix[i][j] = a.matrix[i][j] * b.matrix[i][j];
      }
    }

    return result;
  }
}
