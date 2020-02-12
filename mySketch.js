//Existing bubble collection
var existBubbles = [];
//The total number of bubbles that can be produced
var allBubbleAmount = 1000;
//Bubble radius
var maxBubbleSize = 30;
//color group
var colorPairs = [{R: 187, G: 255, B: 256}, {R: 238, G: 210, B: 238}, {R: 227, G: 16, B: 140}, {
    R: 52,
    G: 240,
    B: 70
}, {R: 187, G: 227, B: 54}];
//switching scope size
var inSwitchScope = 10;
//Bubbles acceleration (default)
var acceleration = 0.2;
//Current subscript of a large collection of arrays
var allFontArrayCurrentPosition = 0;
//large collection of arrays
var allFontArray = [];
//Microphone related variable
var input;
//The volume thresholds
var threshold = 0.5;
//Current mode
var switchModeNow = 1;
//Whether to let all the existed bubbles disappear or not
var goingDead = false;
//Ocean background theme color
var OceanColorMode = 1;


let song;

function preload() {
  song = loadSound('musicE.mp3');
}

function setup() {
   
    createCanvas(windowWidth, windowHeight);
    noStroke();
    // blendMode(ADD);
    // imageMode(CENTER);
    // frameRate(60);

    
    //The translation value of Y-axis direction
    var transY = map(1, 0, 2, 0, height) - 200;
    // Custom function ChangeTheFontPosition()
    ChangeTheFontPosition(I, map(0, 0, 8, 200, width - 200) - 200, transY);//200,
    ChangeTheFontPosition(L, map(2, 0, 8, 200, width - 200) - 200, transY);//500,
    ChangeTheFontPosition(o, map(3, 0, 8, 200, width - 200) - 200, transY);//700,
    ChangeTheFontPosition(v, map(4, 0, 8, 200, width - 200) - 200, transY);//900,
    ChangeTheFontPosition(e, map(5, 0, 8, 200, width - 200) - 200, transY);//1100,
    //ChangeTheFontPosition(U, map(7, 0, 8, 200, width - 200) - 200, transY);//1100,
    //ChangeTheFontPosition(di, map(7, 0, 8, 200, width - 200) - 200, transY);//1100,
    ChangeTheFontPosition(U, map(8, 0, 8, 200, width - 200) - 200, transY);//1100,
   
    //Translation of the love shape
    ChangeTheFontPosition(heart, map(1, 0, 2, 200, width - 200) - 300, map(1, 0, 2, 0, height) - 300);

    //Splice array
    allFontArray = allFontArray.concat(I).concat(L).concat(o).concat(v).concat(e).concat(U);
    song.loop(); 
    //song = loadSound('musicE.mp3');
    //Mic initiation
    input = new p5.AudioIn();
    input.start();


}


function draw() {
    
    background(0);
    drawOceanWave();

	//Guide information
    if (existBubbles.length == 0) {
        fill(255);
        textAlign(CENTER);
        textSize(32);
       //text("Drag mouse to add bubbles . Speak loudly or Click the space key to switch mode", width / 2, height / 2);
        textAlign(LEFT);
       // text("<--Volume Bar", 20, height - 20);
    }

    text("To   Elain", width-20, height - 20);

    //System function to get the volume directly
    let volume = input.getLevel();
    //Draw a volume bar
    //drawTheVolumeBar(volume);
 
    //Change the bubbles running mode and background theme color when exceeding the volume threshold
    if (volume > threshold) {
        //Change the ocean background theme color
        OceanColorMode = random([0, 1, 2, 3, 4, 5]);
        //Change the running mode of the bubble
        if (switchModeNow == 1) {
            
            for (let i = 0; i <= this.existBubbles.length - 1; i++) {
                this.existBubbles[i].state = 2;
            }
            switchModeNow = 2;

        } else if (switchModeNow == 2) {
            for (let i = 0; i <= this.existBubbles.length - 1; i++) {
                this.existBubbles[i].state = 3;
            }
            switchModeNow = 3;
        }
        else if (switchModeNow == 3) {
            for (let i = 0; i <= this.existBubbles.length - 1; i++) {
                this.existBubbles[i].state = 1;
            }
            switchModeNow = 1;
        }

    } else {
        //Bubble normal display
        if (!goingDead) {
            //Bubbles grow larger following the increase of voice
            var plus = 0;
            plus = map(volume, 0, 1, 0, 20);
            for (let i = 0; i <= this.existBubbles.length - 1; i++) {
                this.existBubbles[i].size = this.existBubbles[i].originSize + plus;
            }
        }

    }

    // bubbles destroy process
    if (goingDead) {
        for (let i = 0; i <= this.existBubbles.length - 1; i++) {
           //let bubble go lager and shallower
            var isDeaded = this.existBubbles[i].boom();
            //Allow the bubble to continue moving
            this.existBubbles[i].run();
            if (isDeaded) {
				//delete bubble
                existBubbles.splice(i, 1);
            }
        }
    } else {
        //Normal mode
        for (let i = 0; i <= this.existBubbles.length - 1; i++) {
            //Modify the real-time location of the bubble
            this.existBubbles[i].run();
            //Draw the current bubble
            this.existBubbles[i].display();
        }
    }

    //show the guide information
    if (existBubbles.length == 0) {
        goingDead = false;
        allBubbleAmount = 1000;
    }

}

//Drag the mouse
function touchMoved() {
   
    if (allBubbleAmount > 0 && !(mouseX > (width - 300) && mouseY < 300)) {
        //randomly taking the subscript inside the allFontArray array
        allFontArrayCurrentPosition = floor(random(0, allFontArray.length));
       //new a bubble and then put it into existBubbles array
        existBubbles.push(new Bubble(allFontArray[allFontArrayCurrentPosition].X, allFontArray[allFontArrayCurrentPosition].Y,
            mouseX, mouseY, allFontArray[allFontArrayCurrentPosition].No, allFontArray[allFontArrayCurrentPosition].Font, switchModeNow));
        //let the number of bubbles to be reduced by 1
        allBubbleAmount--;
    }

}

//Trigger keyboard function
function keyPressed() {
    if (key == ' ') {
        //change the theme color of the ocean background
        OceanColorMode = random([0, 1, 2, 3, 4, 5]);
        //change bubble runing mode
        if (switchModeNow == 1) {        
            for (let i = 0; i <= this.existBubbles.length - 1; i++) {
                this.existBubbles[i].state = 2;
            }
            switchModeNow = 2;
        } else if (switchModeNow == 2) {
            for (let i = 0; i <= this.existBubbles.length - 1; i++) {
                this.existBubbles[i].state = 3;
            }
            switchModeNow = 3;
        }
        else if (switchModeNow == 3) {
            for (let i = 0; i <= this.existBubbles.length - 1; i++) {
                this.existBubbles[i].state = 1;
            }
            switchModeNow = 1;
        }
    } else if (key == 'D' || key == 'd') {
        goingDead = true;
    } else if (key == 'S' || key == 's') {
        saveCanvas('png');
    }
}

//draw a sound bar
function drawTheVolumeBar(volume) {
    let y = map(volume, 0, 1, height, 0);
    let ythreshold = map(threshold, 0, 1, height, 0);
    push();
    noStroke();
    fill(0);
    //draw the entire black background strip
    rect(0, 0, 20, height);
    // Then draw a rectangle on the graph, sized according to volume
    //draw a volume bar - yellow color
    fill(255, 204, 0);
    rect(0, y, 20, y);
    //draw a red line
    stroke(255, 106, 106);
    strokeWeight(4);
    line(0, ythreshold, 19, ythreshold);
    pop();
}

//Shift the coordinates of the array
function ChangeTheFontPosition(X, posX, posY) {
    for (var i = 0; i < X.length; i++) {
        X[i].X += posX;
        X[i].Y += posY;
    }
}

//Bubble class
class Bubble {
    
    constructor(targetX, targetY, currentX, currentY, no, belongFront, currenMode) {
        //target coordinates
        this.targetX = targetX;
        this.targetY = targetY;
        //current coordinates
        this.currentX = currentX;
        this.currentY = currentY;
        //starting coordinates
        this.sourceX = currentX;
        this.sourceY = currentY;
      
        this.middlelengthX = abs(this.targetX - this.sourceX) / 2;
        this.middlelengthY = abs(this.targetY - this.sourceY) / 2;
        //speed in the x y axis
        this.speedX = 0;
        this.speedY = 0;
        //Font coordinate serial number
        this.No = no;
		//Attribution array flag
        this.belongFront = belongFront;
        //subscript of the “heart” array
        this.heartNo = floor(random(0, heart.length - 1));
        //bubble current size
        this.size = random(1, maxBubbleSize);
		//bubble original size
        this.originSize = this.size;
        //bubble color
        let r = [0, 0, 1, 1, 2, 3, 4];
        this.color = colorPairs[random(r)];
        //bubble motion mode
        this.state = currenMode;
    }

    //change different modes according to "state"
    run() {
        let difX = this.targetX - this.currentX;
        let difY = this.targetY - this.currentY;
		//if difX and difY is smaller than inSwitchScope,switch the target coordinates
        if (abs(difX) < inSwitchScope && abs(difY) < inSwitchScope) {
            if (this.state == 1) {
                this.runMode_1();
            } else if (this.state == 2) {
                this.runMode_2();
            } else if (this.state == 3) {
                this.runMode_3();
            }

        } else {
            //In the X direction, the first half is accelerated
            if (abs(difX) >= inSwitchScope) {
                if (this.middlelengthX < abs(difX)) {
                    //Determine the positive and negative direction
                    if (difX > 0) {
                        this.currentX += this.speedX;
                        this.speedX += acceleration;
                    } else {
                        this.currentX -= this.speedX;
                        this.speedX += acceleration;
                    }
                }//After half reduction
                else {
                    //Determine the positive and negative direction
                    if (difX > 0) {
                        this.currentX += this.speedX;
                        this.speedX -= acceleration;
                    } else {
                        this.currentX -= this.speedX;
                        this.speedX -= acceleration;
                    }
                }
            }
           
            //In the Y direction, the first half is accelerated
            if (abs(difY) >= inSwitchScope) {
                if (this.middlelengthY < abs(difY)) {
                    //Determine the positive and negative direction
                    if (difY > 0) {
                        this.currentY += this.speedY;
                        this.speedY += acceleration;
                    } else {
                        this.currentY -= this.speedY;
                        this.speedY += acceleration;
                    }
                }//After half reduction
                else {
                    //Determine the positive and negative direction
                    if (difY > 0) {
                        this.currentY += this.speedY;
                        this.speedY -= acceleration;
                    } else {
                        this.currentY -= this.speedY;
                        this.speedY -= acceleration;
                    }
                }
            }

        }


    }

    //motion mode 1 -- 'I LOVE IT' shape 
    runMode_1() {
        var Array = [];
        if (this.belongFront == 'I') {
            Array = I;       //data is saved in font.js
        } else if (this.belongFront == 'L') {
            Array = L;
        } else if (this.belongFront == 'o') {
            Array = o;
        } else if (this.belongFront == 'v') {
            Array = v;
        } else if (this.belongFront == 'e') {
            Array = e;
        } else if (this.belongFront == 'S') {
            Array = S;
        } else if (this.belongFront == 'Y') {
            Array = Y;
        } else if (this.belongFront == 'D') {
            Array = D;
        } else if (this.belongFront == 'U') {
            Array = U;
        } else if (this.belongFront == 'di') {
            Array = di;
        } else if (this.belongFront == 'pi') {
            Array = pi;
        } else if (this.belongFront == 't') {
            Array = t;
        }
        var choices = [-2, -1, 1, 2];
        var changeNo = this.No + random(choices);
        if (changeNo < 0) changeNo = 0;
        if (changeNo >= Array.length - 1) changeNo = Array.length - 1;
        this.No = changeNo;
        this.targetX = Array[changeNo].X;
        this.targetY = Array[changeNo].Y;
        this.middlelengthX = abs(this.targetX - this.currentX) / 2;    
        this.middlelengthY = abs(this.targetY - this.currentY) / 2;
        this.speedX = 0;  
        this.speedY = 0;
    }

    //motion mode 2 --dispersion
    runMode_2() {

        this.targetX = this.targetX + floor(random(-300, 300));
        this.targetY = this.targetY + floor(random(-300, 300));
        this.middlelengthX = abs(this.targetX - this.currentX) / 2;
        this.middlelengthY = abs(this.targetY - this.currentY) / 2;
        this.speedX = 0;
        this.speedY = 0;
    }

    //motion mode 3 -- 'heart' shape
    runMode_3() {
        var choices = [-4, -3, -2, -1, 1, 2, 3, 4];
        var changeNo = this.heartNo + random(choices);
        if (changeNo < 0) changeNo = 0;
        if (changeNo >= heart.length - 1) changeNo = heart.length - 1;  
        this.heartNo = changeNo;
		//data is saved in font.js
        this.targetX = heart[changeNo].X;
        this.targetY = heart[changeNo].Y;
        this.middlelengthX = abs(this.targetX - this.currentX) / 2;
        this.middlelengthY = abs(this.targetY - this.currentY) / 2;
        this.speedX = 0;
        this.speedY = 0;
    }

    //draw the current bubble
    display() {
        fill(this.color.R, this.color.G, this.color.B);
        ellipse(this.currentX, this.currentY, this.size, this.size);
    }

    //Bubble vanishing process
    boom() {
        this.size += random(1, 10);
        //The bubbles get bigger and shallower
        if (this.size < width / 10) {
            var value = map(this.size, 0, width / 10, 0, 255);
            fill(this.color.R, this.color.G, this.color.B, 255 - value);
            ellipse(this.currentX, this.currentY, this.size, this.size);
            return false;
        } else {
            //When the size of the bubble exceeds width/10, it returns true, indicating that the bubble can be deleted
            return true;
        }

    }
}

//dat-gui control panel code
var Options = function(){
	this.Speed = 0.2;//bubbles speed
    this.Threshold = 0.5;//volume threshold
    this.OceanColor = 3;//ocean background theme color
    this.Color1 = [187, 255, 255]; //bubble color 1
    this.Color2 = [238, 210, 238]; // bubble color 2
    this.Color3 = [227, 16, 140]; // bubble color 3
    this.Color4 = [52, 240, 70]; //bubble color 4
    this.Color5 = [187, 227, 54]; // bubble color 5
    this.BubulleMaxSize = 30;//bubble max size
    //clean all bubbles
    this.CleanBubbles = function () {
        goingDead = true;
    };
    //switch bubbles motion mode
    this.SwitchMode = function () {
        if (switchModeNow == 1) {
            for (let i = 0; i <= existBubbles.length - 1; i++) {
                existBubbles[i].state = 3;
            }
            switchModeNow = 3;
        } else if (switchModeNow == 3) {
            for (let i = 0; i <= existBubbles.length - 1; i++) {
                existBubbles[i].state = 2;
            }
            switchModeNow = 2;
        }
        else if (switchModeNow == 2) {
            for (let i = 0; i <= existBubbles.length - 1; i++) {
                existBubbles[i].state = 1;
            }
            switchModeNow = 1;
        }
    };

};

//show datgui control panel
window.onload = function () {
    var options = new Options();
    var gui = new dat.GUI();

    gui.add(options, 'SwitchMode');
    var controller1 = gui.add(options, 'Speed', 0.01, 0.5);
    var controller2 = gui.add(options, 'Threshold', 0.1, 1);
    var controller5 = gui.add(options, 'BubulleMaxSize', 20, 80);
    var controller10 = gui.add(options, 'OceanColor', {Blue: 1, Green: 2, Red: 3, Purple: 4, Grey: 5, Black: 0});
    var controller3 = gui.addColor(options, 'Color1');
    var controller4 = gui.addColor(options, 'Color2');
    var controller6 = gui.addColor(options, 'Color3');
    var controller7 = gui.addColor(options, 'Color4');
    var controller8 = gui.addColor(options, 'Color5');
    gui.add(options, 'CleanBubbles');

    
    controller2.onChange(function (value) {
		//change the global threshold value
        threshold = value;
    });
    controller3.onChange(function (value) {
        colorPairs[0] = {R: value[0], G: value[1], B: value[2]};  
    });
    controller4.onChange(function (value) {
        colorPairs[1] = {R: value[0], G: value[1], B: value[2]};
    });
    controller6.onChange(function (value) {
        colorPairs[2] = {R: value[0], G: value[1], B: value[2]};
    });
    controller7.onChange(function (value) {
        colorPairs[3] = {R: value[0], G: value[1], B: value[2]};
    });
    controller8.onChange(function (value) {
        colorPairs[4] = {R: value[0], G: value[1], B: value[2]};
    });
    controller1.onChange(function (value) {
		//change the global acceleration value
        acceleration = value;
    });
    controller5.onChange(function (value) {
		//change the global maxBubbleSize value
        maxBubbleSize = value;
    });

    controller10.onChange(function (value) {
		//change the global OceanColorMode value
        OceanColorMode = value;
    });

};

//draw wave of the ocean background 
var yoff = [0.0, 1.0, 2.0, 3.0, 4.0];
function wave(color, a, b, p) {
    push();
    blendMode(DIFFERENCE);
    fill(color);
    // We are going to draw a polygon out of the wave points
    beginShape();

    let xoff = 0; // Option #1: 2D Noise
    // let xoff = yoff; // Option #2: 1D Noise
    // Iterate over horizontal pixels
    for (let x = 0; x <= width + 100; x += 100) {
        // Calculate a y value according to noise, map to

        // Option #1: 2D Noise
        let y = map(noise(xoff, yoff[p]), 0, 1, a, b);

        // Option #2: 1D Noise
        // let y = map(noise(xoff), 0, 1, 200,300);

        // Set the vertex
        curveVertex(x, y);
        // Increment x dimension for noise
        xoff += 0.07;
    }
    // increment y dimension for noise
    yoff[p] += 0.01;
    curveVertex(width + 100, b);
    curveVertex(width, height);
    curveVertex(0, height);
    endShape(CLOSE);
    pop();
}
//draw ocean background 
function drawOceanWave() {
    var hw = map(1, 0, 6, 0, height);
    var hw1 = map(2, 0, 6, 0, height);
    var hw2 = map(3, 0, 6, 0, height);
    var hw3 = map(4, 0, 6, 0, height);
    var gap = 200;
    if (OceanColorMode == 1) {
        wave('#63B8FF', hw, hw + gap, 0);
        wave('#5CACEE', hw1, hw1 + gap, 1);
        wave('#4F94CD', hw2, hw2 + gap, 2);
        wave('#36648B', hw3, hw3 + gap, 3);
    } else if (OceanColorMode == 2) {
        wave('#7FFFD4', hw, hw + gap, 0);
        wave('#76EEC6', hw1, hw1 + gap, 1);
        wave('#66CDAA', hw2, hw2 + gap, 2);
        wave('#458B74', hw3, hw3 + gap, 3);
    } else if (OceanColorMode == 3) {
        wave('#FF6A6A', hw, hw + gap, 0);
        wave('#EE6363', hw1, hw1 + gap, 1);
        wave('#CD5555', hw2, hw2 + gap, 2);
        wave('#8B3A3A', hw3, hw3 + gap, 3);
    } else if (OceanColorMode == 4) {
        wave('#AB82FF', hw, hw + gap, 0);
        wave('#9F79EE', hw1, hw1 + gap, 1);
        wave('#8968CD', hw2, hw2 + gap, 2);
        wave('#5D478B', hw3, hw3 + gap, 3);
    } else if (OceanColorMode == 5) {
        wave('#B5B5B5', hw, hw + gap, 0);
        wave('#9C9C9C', hw1, hw1 + gap, 1);
        wave('#828282', hw2, hw2 + gap, 2);
        wave('#696969', hw3, hw3 + gap, 3);
    }
    else if (OceanColorMode == 0) {

    }
}