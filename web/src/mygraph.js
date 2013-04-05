/*
A simple javascript library for plotting graphs. 
Originally from  Eric Rowell on http://www.html5canvastutorials.com
*/
function Graph(config){
    this.canvas = config.canvas;
    this.minX = config.minX;
    this.minY = config.minY;
    this.maxX = config.maxX;
    this.maxY = config.maxY;
 
    this.context = this.canvas.getContext("2d");
    this.centerY = Math.abs(this.minY / (this.maxY - this.minY)) * this.canvas.height;
    this.centerX = Math.abs(this.minX / (this.maxX - this.minX)) * this.canvas.width;
    this.iteration = 0.1;
    this.numXTicks = (this.maxX-this.minX)/20;
    this.numYTicks = (this.maxY-this.minY)/20;
    this.xTickHeight = (this.maxY-this.minY)/60;;
    this.yTickWidth =(this.maxX-this.minX)/60; ;
    this.scaleX = this.canvas.width / (this.maxX - this.minX);
    this.scaleY = this.canvas.height / (this.maxY - this.minY);
    this.axisColor = "#aaa";
 
    this.axisLabel=Math.round(this.canvas.height/40);

    // draw x y axis and tick marks
    this.drawXAxis();
    this.drawYAxis();
    this.drawXAxisTicks();
    this.drawYAxisTicks();
}
 
Graph.prototype.drawXAxis = function(){
    var context = this.context;
    context.beginPath();
    context.moveTo(0, this.centerY);
    context.lineTo(this.canvas.width, this.centerY);
    context.strokeStyle = this.axisColor;
    context.lineWidth = 2;
    context.stroke();
};
 
Graph.prototype.drawYAxis = function(){
    var context = this.context;
    context.beginPath();
    context.moveTo(this.centerX, 0);
    context.lineTo(this.centerX, this.canvas.height);
    context.strokeStyle = this.axisColor;
    context.lineWidth = 2;
    context.stroke();
};
 
Graph.prototype.drawXAxisTicks = function(){
    var context = this.context;
    var xInterval = this.canvas.width / this.numXTicks;
    for (var n = xInterval; n < this.canvas.width; n += xInterval) {
        context.beginPath();
        context.moveTo(n, this.centerY - this.xTickHeight / 2);
        context.lineTo(n, this.centerY + this.xTickHeight / 2);
        context.strokeStyle = this.axisColor;
        context.lineWidth = 2;
        context.stroke();
	context.font=this.axisLabel+"px Arial";
	var tickVal=Math.round((n-this.centerX)/this.scaleX);
//	context.fillText(tickVal,n,this.centerY+this.xTickHeight);
    }
};
 
Graph.prototype.drawYAxisTicks = function(){
    var context = this.context;
    var yInterval = this.canvas.height / this.numYTicks;
    for (var n = yInterval; n < this.canvas.height; n += yInterval) {
        context.beginPath();
        context.moveTo(this.centerX - this.yTickWidth / 2, n);
        context.lineTo(this.centerX + this.yTickWidth / 2, n);
        context.strokeStyle = this.axisColor;
        context.lineWidth = 2;
        context.stroke();
	context.font=this.axisLabel+"px Arial";
	var tickVal=Math.round((this.centerY-n)/this.scaleY);
	context.fillText(tickVal,this.centerX+this.yTickWidth,n);
    }
};
 
Graph.prototype.drawEquation = function(equation, color, thickness){
    var canvas = this.canvas;
    var context = this.context;
 
    context.save();
    this.transformContext();
 
    context.beginPath();
    context.moveTo(this.minX, equation(this.minX));
 
    for (var x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {
        context.lineTo(x, equation(x));
    }
 
    context.restore();
    context.lineJoin = "round";
    context.lineWidth = thickness;
    context.strokeStyle = color;
    context.stroke();
 
};

Graph.prototype.drawArrays = function(xVals, yVals, colour, thickness) {
    var canvas = this.canvas;
    var context = this.context;
    

    //Should check that xVals and yVals are arrays and of length >1
    //Anyhow proceeding along
    if(xVals.length>1 && yVals.length>1) {
	
	context.save();
	this.transformContext();
	
	context.beginPath();
	context.moveTo(xVals[0],yVals[0]);

	for(var i=1;i<xVals.length;i++) {
	    context.lineTo(xVals[i],yVals[i]);
	}
	
	context.restore();
	context.lineJoin = "round";
	context.lineWidth = thickness;
	context.strokeStyle = colour;
	context.stroke();
    }
 
}

 
Graph.prototype.transformContext = function(){
    var canvas = this.canvas;
    var context = this.context;
 
    // move context to center of canvas
    this.context.translate(this.centerX, this.centerY);
 
    // stretch grid to fit the canvas window, and 
    // invert the y scale so that that increments
    // as you move upwards
    context.scale(this.scaleX, -this.scaleY);
};
 

