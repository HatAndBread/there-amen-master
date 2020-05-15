import { onBeingHeldDown, onBeingLetUp } from './MusicLogic';

export const s2pd = {
  allAudioObjects: [],
  loadedAudio: [],
  allGameObjects: [],
  allBackgrounds: [],
  clickableObjects: [],
  draggableObjects: [],
  dragArray: [],
  holdableObjects: [],
  hitDetectObjects: [],
  dragStarted: false,
  draggingWithMouse: true,
  holdStarted: false,
  mouseX: 0,
  mouseY: 0,
  touchX: 0,
  touchY: 0,
  touchMoveX: 0,
  touchMoveY: 0,
  touchEndX: 0,
  touchEndY: 0,
  objectsToLoad: [],
  orientation: undefined,
  exit: true,
  enableDragAndDrop: true,
  firstTimeThroughLoop: true,
  aspectRatio: 16 / 9,
  numberOfClicks: 0,

  firstClick: function () {
    this.numberOfClicks += 1;
    if (this.numberOfClicks === 1) {
    }
  },

  changeCanvasBackground: function (color1, color2, color3) {
    s2pd.canvas.style.backgroundColor = `rgb(${color1},${color2},${color3})`;
  },
  choose: function (arrayOfOptions) {
    let chooser = Math.floor(Math.random() * arrayOfOptions.length);
    return arrayOfOptions[chooser];
  },

  getJson: async function (url) {
    let receive = await fetch(url).catch((e) => console.log('data not received: ' + e));
    let data = await receive.json().catch((e) => console.log(e));
    if (data) {
      //check if truthy (i.e. not undefined)
      console.log(data);
      return data;
    }
  },
  Img: class {
    constructor(name, url, xPos, yPos, width, height) {
      this.url = url;
      this.xPos = xPos;
      this.yPos = yPos;
      this.width = width;
      this.height = height;
      this.name = name;
      this.bindable = false;
      this.deadOutsideCanvas = false;
      this.dragging = false;
      this.detectHit = false;
      this.velX = 0;
      this.velY = 0;
      this.id = 0;
      this.image = undefined;
      this.finishedLoading = false;

      //this.hitBoxX = this.xPos;
      //this.hitBoxY = this.yPos;
      //this.hitBoxWidth = this.width;
      //this.hitBoxHeight = this.height;

      this.fetchImg();
    }
    make() {}
    async fetchImg() {
      let yo = document.createElement('img');
      yo.id = this.name;
      document.body.appendChild(yo);
      let response = await fetch(this.url).catch((e) => {
        console.log(e);
      });
      let data = await response.blob().catch((e) => {
        console.log(e);
      });
      this.image = document.getElementById(this.name);
      this.image.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });
      this.image.src = URL.createObjectURL(data);
      this.image.style.position = 'fixed';
      this.image.style.top = `${this.yPos}px`;
      this.image.style.left = `${this.xPos}px`;
      this.image.style.width = `${this.width}`;
      this.image.style.height = `${this.height}`;
      this.finishedLoading = true;
    }
  },

  ///01. get a random integer between two numbers.
  randomBetween: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /// get a random integer between two numbers excluding zero (example between -10 and 10 except for zero)
  sansZeroRandomBetween: function (min, max, myNum) {
    do {
      myNum = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (myNum === 0);
    return myNum;
  },

  roundToDecimals: function (num, howManyDecimals) {
    let multiplier;
    switch (howManyDecimals) {
      case 0:
        multiplier = 1;
        break;
      case 1:
        multiplier = 10;
        break;
      case 2:
        multiplier = 100;
        break;
      case 3:
        multiplier = 1000;
        break;
      case 4:
        multiplier = 10000;
        break;
      case 5:
        multiplier = 100000;
        break;
      case 6:
        multiplier = 1000000;
        break;
      default:
        multiplier = 100;
        console.log('choose a valid number idiot');
    }

    return Math.round((num + Number.EPSILON) * multiplier) / multiplier;
  },

  ///02. random no repeat array
  //get random elements from an arrray witout repeating.
  // must call it with arrayToBeRandomized as the array you want randomized,
  //and accompanyingArray as an empty array unique to the array to be randomized.
  // EXAMPLE: getRandomNoRepeatLoop(myArray, myArrayEmpty)
  getRandomNoRepeatLoop: function (arrayToBeRandomized, accompanyingArray, theWord, theNumber) {
    if (arrayToBeRandomized.length > 0) {
      theNumber = Math.floor(Math.random() * arrayToBeRandomized.length);
      theWord = arrayToBeRandomized[theNumber];
      accompanyingArray.push(theWord);
      arrayToBeRandomized.splice(theNumber, 1);
      return theWord;
    } else {
      for (let c = 0; c < accompanyingArray.length; c++) {
        arrayToBeRandomized.push(accompanyingArray[c]);
        if (c === accompanyingArray.length - 1) {
          accompanyingArray.splice(0, accompanyingArray.length);
          theNumber = Math.floor(Math.random() * arrayToBeRandomized.length);
          theWord = arrayToBeRandomized[theNumber];
          accompanyingArray.push(theWord);
          arrayToBeRandomized.splice(theNumber, 1);
          return theWord;
        }
      }
    }
  },

  ///03. getRandomColor
  getRandomColor: function () {
    return `rgb(${this.randomBetween(0, 255)},${this.randomBetween(0, 255)},${this.randomBetween(0, 255)})`;
  },
  Rainbow: class {
    constructor(rAscending, gAscending, bAscending, r, g, b, rIncrement, gIncrement, bIncrement) {
      this.rAscending = rAscending;
      this.gAscending = gAscending;
      this.bAscending = bAscending;
      this.r = r;
      this.g = g;
      this.b = b;
      this.rIncrement = rIncrement;
      this.gIncrement = gIncrement;
      this.bIncrement = bIncrement;
    }
    updateRainbow() {
      if (!this.rAscending) {
        if (this.r > 0) {
          this.r -= this.rIncrement;
        }
        if (this.r <= 0) {
          this.rAscending = true;
        }
      }
      if (!this.gAscending) {
        if (this.g > 0) {
          this.g -= this.gIncrement;
        }
        if (this.g <= 0) {
          this.gAscending = true;
        }
      }
      if (!this.bAscending) {
        if (this.b > 0) {
          this.b -= this.bIncrement;
        }
        if (this.b <= 0) {
          this.bAscending = true;
        }
      }
      if (this.rAscending) {
        if (this.r < 255) {
          this.r += this.rIncrement;
        }
        if (this.r >= 255) {
          this.rAscending = false;
        }
      }
      if (this.gAscending) {
        if (this.g < 255) {
          this.g += this.gIncrement;
        }
        if (this.g >= 255) {
          this.gAscending = false;
        }
      }
      if (this.bAscending) {
        if (this.b < 255) {
          this.b += this.bIncrement;
        }
        if (this.b >= 255) {
          this.bAscending = false;
        }
      }
      return `rgb(${this.r},${this.g},${this.b})`;
    }
  },
  TrueRainbow: class {
    constructor(increment, startColor) {
      this.increment = increment;
      this.startColor = startColor.toLowerCase();
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.rDescending = false;
      this.gDescending = false;
      this.bDescending = false;
      this.builder();
    }
    builder() {
      if (this.startColor === 'r') {
        this.r = 255;
        this.rDescending = true;
      }
      if (this.startColor === 'g') {
        this.g = 255;
        this.gDescending = true;
      }
      if (this.startColor === 'b') {
        this.b = 255;
        this.bDescending = true;
      }
    }
    updateRainbow() {
      if (this.rDescending) {
        if (this.r >= 0) {
          this.r -= this.increment;
          this.g += this.increment;
        }
        if (this.r <= 0) {
          this.rDescending = false;
          this.gDescending = true;
        }
      }
      if (this.gDescending) {
        if (this.g >= 0) {
          this.g -= this.increment;
          this.b += this.increment;
        }
        if (this.g <= 0) {
          this.gDescending = false;
          this.bDescending = true;
        }
      }

      if (this.bDescending) {
        if (this.b >= 0) {
          this.b -= this.increment;
          this.r += this.increment;
        }
        if (this.b <= 0) {
          this.bDescending = false;
          this.rDescending = true;
        }
      }

      return `rgb(${this.r},${this.g},${this.b})`;
    }
  },
  ///04. return a random integer without any repeats between a range. when every number has been used will start over with the same set of numbers.
  ///
  ///  const newSet = new NoRepeatIntegerSet (15,30)
  ///  console.log(newSet.getNum()) <---- logs a random number between 15 and 30 without repeating itself
  ///                                     until all numbers within the range have been used.

  NoRepeatIntegerSet: class {
    constructor(min, max) {
      this.max = max;
      this.min = min;
      this.originalMax = max;
      this.originalMin = min;
      this.numArray = [];
      this.randomizedArray = [];
      this.arrayWidth = this.originalMax - this.originalMin;
      this.numnum = 0;
      this.numnum2 = 0;
      this.numnum3 = 0;
      this.make();
    }
    make() {
      for (let i = 0; i < this.arrayWidth + 1; i++) {
        this.numArray[i] = this.min;
        this.min += 1;
      }
      for (let i = 0; i < this.arrayWidth + 1; i++) {
        this.numnum = Math.floor(Math.random() * this.numArray.length);
        this.numnum2 = this.numArray[this.numnum];
        this.randomizedArray.push(this.numnum2);
        this.numArray.splice(this.numnum, 1);
      }
    }
    getNum() {
      if (this.randomizedArray.length > 1) {
        this.numnum3 = this.randomizedArray[0];
        this.randomizedArray.splice(0, 1);
        return this.numnum3;
      }
      if (this.randomizedArray.length === 1) {
        this.numnum3 = this.randomizedArray[0];
        this.randomizedArray.splice(0, 1);
        this.numArray.splice(0, this.numArray.length);
        this.randomizedArray.splice(0, this.randomizedArray.length);
        this.max = this.originalMax;
        this.min = this.originalMin;
        this.numnum = 0;
        this.numnum2 = 0;
        this.make(this.originalMin, this.originalMax);
        return this.numnum3;
      }
    }
  },

  /////Random boolean
  randomBoolean: function () {
    let number = Math.round(Math.random());
    if (number === 0) {
      console.log('true');
      return true;
    } else {
      console.log('false');
      return false;
    }
  },

  exists: function (name, objectName) {
    for (let i = 0; i < s2pd.allGameObjects.length; i++) {
      objectName = String(s2pd.allGameObjects[i].name);
      if (objectName === name) {
        return true;
      }
    }
  },

  onScreen: function (object) {
    if (object.xPos >= 0 && object.xPos <= s2pd.width && object.yPos >= 0 && object.yPos <= s2pd.height) {
      object.onScreen = true;
      return true;
    } else {
      object.onScreen = false;
      return false;
    }
  },

  finalize: function (object) {
    if (object instanceof this.Sprite) {
      object.animations.shift();
    }
    if (object instanceof this.Background) {
      s2pd.allBackgrounds.push(object);
    } else {
      s2pd.allGameObjects.push(object);
    }
  },

  //WAIT FUNCTIONS

  waitThen: function (howLong, whenStop, name, whatToDo, howMuch1, howMuch2, howMuch3, objectName, theObject) {
    // leave objectName and theObject blank
    for (let i = 0; i < s2pd.allGameObjects.length; i++) {
      objectName = String(s2pd.allGameObjects[i].name);
      if (objectName === name) {
        theObject = s2pd.allGameObjects[i];
        if (
          Date.now() - theObject.timeStamp > howLong * 1000 &&
          Date.now() - theObject.timeStamp < (howLong + whenStop) * 1000
        ) {
          if (whatToDo === 'make') {
            theObject.make();
          }
          if (whatToDo === 'destroy') {
            theObject.destroy();
          }
          if (whatToDo === 'makeDraggable') {
            theObject.makeDraggable();
          }
          if (whatToDo === 'makeClickable') {
            theObject.makeClickable();
          }
          if (whatToDo === 'hitDetect') {
            theObject.hitDetect();
          }
          if (whatToDo === 'moveTo') {
            theObject.moveTo(howMuch1, howMuch2);
          }
          if (whatToDo === 'stop') {
            theObject.stop();
          }
          if (whatToDo === 'updateSize') {
            theObject.updateSize(howMuch1);
          }
          if (whatToDo === 'updateOpacity') {
            theObject.updateOpacity(howMuch1);
          }
          if (whatToDo === 'updateColor') {
            theObject.updateColor(howMuch1, howMuch2, howMuch3);
          }
          if (whatToDo === 'updateThickness') {
            theObject.updateColor(howMuch1);
          }
          if (whatToDo === 'addOutline') {
            theObject.addOutline(howMuch1, howMuch2);
          }
          if (whatToDo === 'finalize') {
            theObject.finalize();
          }
        }
      }
    }
  },

  waitThenTriggerOnce: function (howLong, name, whatToDo, howMuch1, howMuch2, howMuch3, objectName, theObject) {
    // leave objectName and theObject blank
    for (let i = 0; i < s2pd.allGameObjects.length; i++) {
      objectName = String(s2pd.allGameObjects[i].name);
      if (objectName === name) {
        theObject = s2pd.allGameObjects[i];
        if (Date.now() - theObject.timeStamp > howLong * 1000 && theObject.triggeredOnce === false) {
          if (whatToDo === 'make') {
            theObject.make();
          }
          if (whatToDo === 'destroy') {
            theObject.destroy();
          }
          if (whatToDo === 'makeDraggable') {
            theObject.makeDraggable();
          }
          if (whatToDo === 'makeClickable') {
            theObject.makeClickable();
          }
          if (whatToDo === 'hitDetect') {
            theObject.hitDetect();
          }
          if (whatToDo === 'moveTo') {
            theObject.moveTo(howMuch1, howMuch2);
          }
          if (whatToDo === 'stop') {
            theObject.stop();
          }
          if (whatToDo === 'updateSize') {
            theObject.updateSize(howMuch1);
            theObject.timeStamp *= 10;
            theObject.triggeredOnce = true;
          }
          if (whatToDo === 'updateOpacity') {
            theObject.updateOpacity(howMuch1);
          }
          if (whatToDo === 'updateColor') {
            theObject.updateColor(howMuch1, howMuch2, howMuch3);
          }
          if (whatToDo === 'updateThickness') {
            theObject.updateColor(howMuch1);
          }
          if (whatToDo === 'addOutline') {
            theObject.addOutline(howMuch1, howMuch2);
          }
        }
      }
    }
  },

  /////***********************SPRITES******************************** */
  ///
  /// Sprite must be laid out in a single row with each frame sized equally.
  /// For example, a 10 frame animation with 32 x 32 pixel individual frames must be laid out
  /// in a 320 x 32 file. The library will take care of the rest.
  ///
  ///  const rabbit = new Sprite ('rabbit', 100,100,10,'./rabbits.png',3) **create rabbit at coordinates 100,100.10 frames in file. source. speed (1 to 60 with one being the fastest)
  ///  rabbit.addAnimation('left',0,4) *** add an animation starting at frame 0 and continuing for 4 frames
  ///  rabbit.addAnimation('right',4,4) *** add an animation starting at frame 4 and continuing for 4 frames
  ///  rabbit.addAnimation('stopLeft',8,1) *** add a single frame animation starting at frame 8
  ///  rabbit.addAnimation('stopRight',9,1)  *** add a single frame animation starting at frame 9
  ///  finalize(rabbit)

  Sprite: class {
    constructor(name, xPos, yPos, numberOfFrames, source, animationSpeed, width, height) {
      this.name = name;
      this.xPos = xPos;
      this.yPos = yPos;
      this.numberOfFrames = numberOfFrames;
      this.width = width;
      this.height = height;
      this.velX = 0;
      this.velY = 0;
      this.source = source;
      this.animationSpeed = animationSpeed + (60 % animationSpeed) / Math.floor(60 / animationSpeed);
      this.refreshRate = 60 / animationSpeed;
      this.loopLength = 0;
      this.timeThroughLoop = 0;
      this.currentFrame = 0;
      this.animations = [[0, 0, 0, 0, 0]];
      this.currentAnimation = 0;
      this.currentAnimationName = '';
      this.clickable = false;
      this.holdable = false;
      this.clicked = false;
      this.colorKey = '';
      this.opacity = 1;
      this.jumping = false;
      this.jumpFrames = 0;
      this.jumpCompleted = false;
      this.jumpHeight = 0;
      this.draggable = false;
      this.dragging = false;
      this.bindable = false;
      this.deadOutsideCanvas = false;
      this.detectHit = false;
      this.hitBoxX = this.xPos;
      this.hitBoxY = this.yPos;
      this.hitBoxWidth = this.width;
      this.hitBoxHeight = this.height;
      this.hitBoxId = undefined;
      this.clickableId = 0;
      this.draggableId = 0;
      this.holdableId = 0;
      this.id = 0;
      this.timeStamp = Date.now();
      this.triggeredOnce = false;
      this.mouseDowned = false;
      this.theImage = document.createElement('img');
      this.load();
    }
    load() {
      s2pd.objectsToLoad.push(this);
    }
    make() {
      this.hitBoxX = this.xPos;
      this.hitBoxY = this.yPos;
      this.hitBoxWidth = this.width;
      this.hitBoxHeight = this.height;
      let heightOfFrame = this.theImage.height;
      let widthOfFrame = this.theImage.width / this.numberOfFrames;

      this.loopLength = this.refreshRate * this.animations[this.currentAnimation][2];

      if (this.timeThroughLoop === this.animationSpeed) {
        this.currentFrame += 1;
        this.timeThroughLoop = 0;
        if (
          this.currentFrame >=
          this.animations[this.currentAnimation][2] /* **this is the number of frames in animation** */
        ) {
          this.currentFrame = 0;
        }
      }
      s2pd.ctx.globalAlpha = this.opacity;
      s2pd.ctx.drawImage(
        this.theImage,
        this.animations[this.currentAnimation][1] * widthOfFrame + this.currentFrame * widthOfFrame,
        0,
        widthOfFrame,
        heightOfFrame,
        this.xPos,
        this.yPos,
        this.width,
        this.height
      );

      s2pd.ctx.globalAlpha = 1;
      if (this.jumping) {
        this.jumpFrames += 1;
        if (this.jumpFrames > 0 && this.jumpFrames <= 5) {
          this.yPos -= this.jumpHeight / 10;
        }
        if (this.jumpFrames > 5 && this.jumpFrames <= 11) {
          this.yPos -= this.jumpHeight / 20;
        }
        if (this.jumpFrames > 11 && this.jumpFrames <= 15) {
          this.yPos -= this.jumpHeight / 25;
        }
        if (this.jumpFrames > 15 && this.jumpFrames <= 17) {
          this.yPos -= this.jumpHeight / 50;
        }
        if (this.jumpFrames > 17 && this.jumpFrames <= 19) {
          this.yPos += this.jumpHeight / 50;
        }
        if (this.jumpFrames > 19 && this.jumpFrames <= 23) {
          this.yPos += this.jumpHeight / 25;
        }
        if (this.jumpFrames > 23 && this.jumpFrames <= 29) {
          this.yPos += this.jumpHeight / 20;
        }
        if (this.jumpFrames > 29 && this.jumpFrames <= 34) {
          this.yPos += this.jumpHeight / 10;
        }
        if (this.jumpFrames >= 35) {
          this.jumping = false;
          this.jumpFrames = 0;
          this.jumpCompleted = true;
        }
      }

      this.timeThroughLoop += 1;
    }
    addAnimation(name, startFrame, numberOfFrames) {
      this.animations.push([name, startFrame, numberOfFrames]);
      this.currentAnimationName = name;
    }
    changeAnimationTo(name) {
      for (let i = 0; i < this.animations.length; i++) {
        if (this.animations[i][0] === name) {
          this.currentAnimation = i;
        }
        this.currentAnimationName = name;
      }
    }
    hitDetect() {
      this.detectHit = true;
      this.hitBoxId = s2pd.hitDetectObjects.length;
      s2pd.hitDetectObjects.push(this);
    }
    makeClickable() {
      this.clickable = true;
      this.draggable = false;
      this.clickableId = s2pd.clickableObjects.length;
      s2pd.clickableObjects.push(this);
    }
    makeDraggable() {
      this.draggable = true;
      this.clickable = false;
      this.draggableId = s2pd.draggableObjects.length;
      s2pd.draggableObjects.push(this);
    }
    makeHoldable() {
      this.holdable = true;
      this.clickable = false;
      this.draggable = false;
      this.holdableId = s2pd.holdableObjects.length;
      s2pd.holdableObjects.push(this);
    }

    control(speedX, speedY) {
      this.xPos += speedX;
      this.yPos += speedY;
    }
    jump(howMuch) {
      this.jumpHeight = howMuch;
      this.jumpFrames = 0;
      this.jumping = true;
    }
    moveTo(newX, newY) {
      this.xPos = newX;
      this.yPos = newY;
    }
    stop() {
      this.velX = 0;
      this.velY = 0;
    }
    bindToCanvas() {
      this.bindable = true;
    }
    destroyOutsideCanvas() {
      this.deadOutsideCanvas = true;
    }
    updatePos() {
      s2pd.allGameObjects[this.id] = this;
      if (this.bindable) {
        if (this.xPos <= 0) {
          this.velX = -this.velX;
        }
        if (this.xPos >= s2pd.width) {
          this.velX = -this.velX;
        }
        if (this.yPos <= 0) {
          this.velY = -this.velY;
        }
        if (this.yPos >= s2pd.height) {
          this.velY = -this.velY;
        }
      }
      if (this.deadOutsideCanvas) {
        if (this.xPos <= s2pd.randomBetween(this.width * -10, this.width * -2)) {
          this.destroy();
        }
        if (this.xPos >= s2pd.randomBetween(s2pd.width + this.width * 2, s2pd.width + this.width * 10)) {
          this.destroy();
        }
        if (this.yPos <= s2pd.randomBetween(this.height * -10, this.height * -2)) {
          this.destroy();
        }
        if (this.yPos >= s2pd.randomBetween(s2pd.height + this.height * 2, s2pd.height + this.height * 10)) {
          this.destroy();
        }
      }
      if (this.dragging === true) {
        s2pd.dragArray[0] = this;
        if (s2pd.draggingWithMouse) {
          this.xPos = s2pd.mouseX;
          this.yPos = s2pd.mouseY;
        } else {
          this.xPos = s2pd.touchMoveX;
          this.yPos = s2pd.touchMoveY;
        }
      } else {
        this.xPos += this.velX;
        this.yPos += this.velY;
        if (this.detectHit) {
          this.hitBoxX = this.xPos;
          this.hitBoxY = this.yPos;
          this.hitBoxWidth = this.width;
          this.hitBoxHeight = this.height;
          s2pd.hitDetectObjects[this.hitBoxId] = this;
        }
      }
    }
    updateSize(howMuch) {
      if (howMuch < 0) {
        if (this.width > howMuch * -1) {
          this.width *= howMuch;
          this.hitBoxWidth = this.width;
        }
        if (this.height > howMuch * -1) {
          this.height *= howMuch;
          this.hitBoxHeight = this.height;
        }
      } else {
        this.width *= howMuch;
        this.height *= howMuch;
        this.hitBoxHeight = this.height;
        this.hitBoxWidth = this.width;
      }
    }
    updateOpacity(howMuch) {
      this.opacity = howMuch;
    }
    destroy() {
      if (this.clickable) {
        s2pd.clickableObjects.splice(this.clickableId, 1);
      }
      if (this.detectHit) {
        s2pd.hitDetectObjects.splice(this.hitBoxId, 1);
        for (let i = 0; i < s2pd.hitDetectObjects.length; i++) {
          s2pd.hitDetectObjects[i].hitBoxId = i;
        }
      }

      s2pd.allGameObjects.splice(this.id, 1);
    }
  },

  Background: class {
    constructor(name, xPos, yPos, numberOfFrames, source, animationSpeed, width, height) {
      this.name = name;
      this.xPos = xPos;
      this.yPos = yPos;
      this.numberOfFrames = numberOfFrames;
      this.width = width;
      this.height = height;
      this.farXpos = this.xPos + this.width;
      this.negFarXPos = 0;
      this.velX = 0;
      this.velY = 0;
      this.source = source;
      this.scrolling = false;
      this.animationSpeed = animationSpeed + (60 % animationSpeed) / Math.floor(60 / animationSpeed);
      this.refreshRate = 60 / animationSpeed;
      this.loopLength = 0;
      this.timeThroughLoop = 0;
      this.currentFrame = 0;
      this.animations = [[0, 0, 0, 0, 0]];
      this.currentAnimation = 0;
      this.opacity = 1;
      this.jumping = false;
      this.jumpFrames = 0;
      this.jumpCompleted = false;
      this.jumpHeight = 0;
      this.id = 0;
      this.timeStamp = Date.now();
      this.triggeredOnce = false;
      this.theImage = document.createElement('img');
      this.load();
    }
    load() {
      s2pd.objectsToLoad.push(this);
    }
    make() {
      s2pd.ctx.globalAlpha = this.opacity;
      let heightOfFrame = this.theImage.height;
      let widthOfFrame = this.theImage.width / this.numberOfFrames;

      this.loopLength = this.refreshRate * this.animations[this.currentAnimation][2];

      if (this.timeThroughLoop === this.animationSpeed) {
        this.currentFrame += 1;
        this.timeThroughLoop = 0;
        if (
          this.currentFrame >=
          this.animations[this.currentAnimation][2] /* **this is the number of frames in animation** */
        ) {
          this.currentFrame = 0;
        }
      }
      if (!this.scrolling) {
        s2pd.ctx.drawImage(
          this.theImage,
          this.animations[this.currentAnimation][1] * widthOfFrame + this.currentFrame * widthOfFrame,
          0,
          widthOfFrame,
          heightOfFrame,
          this.xPos,
          this.yPos,
          this.width + 1,
          this.height
        );
      }

      if (this.scrolling) {
        if (this.width < s2pd.width / 2) {
          this.farXpos = this.width * Math.ceil(s2pd.width / this.width) + this.xPos;
          this.negFarXPos = this.width * Math.ceil(s2pd.width / this.width) * -1 + this.xPos;
          for (let i = 0; i < Math.ceil(s2pd.width / this.width); i++) {
            s2pd.ctx.drawImage(
              this.theImage,
              this.animations[this.currentAnimation][1] * widthOfFrame + this.currentFrame * widthOfFrame,
              0,
              widthOfFrame,
              heightOfFrame,
              this.xPos + i * this.width,
              this.yPos,
              this.width + 1,
              this.height
            );
          }
          if (this.xPos > 0) {
            for (let i = 0; i < Math.ceil(s2pd.width / this.width); i++) {
              s2pd.ctx.drawImage(
                this.theImage,
                this.animations[this.currentAnimation][1] * widthOfFrame + this.currentFrame * widthOfFrame,
                0,
                widthOfFrame,
                heightOfFrame,
                this.xPos - i * this.width,
                this.yPos,
                this.width + 1,
                this.height
              );
            }
          }

          if (this.farXpos < s2pd.width) {
            s2pd.ctx.drawImage(
              this.theImage,
              this.animations[this.currentAnimation][1] * widthOfFrame + this.currentFrame * widthOfFrame,
              0,
              widthOfFrame,
              heightOfFrame,
              this.farXpos,
              this.yPos,
              this.width + 1,
              this.height
            );
            this.xPos = 0;
          }

          if (this.negFarXPos >= -this.width) {
            this.xPos = 0;
          }
        }
        if (this.width >= s2pd.width / 2 && this.width < s2pd.width) {
          this.farXpos = this.xPos + this.width;
          let leftOvers = this.width * 2 - s2pd.width + this.width;
          s2pd.ctx.drawImage(
            this.theImage,
            this.animations[this.currentAnimation][1] * widthOfFrame + this.currentFrame * widthOfFrame,
            0,
            widthOfFrame,
            heightOfFrame,
            this.xPos,
            this.yPos,
            this.width + 1,
            this.height
          );
          s2pd.ctx.drawImage(
            this.theImage,
            this.animations[this.currentAnimation][1] * widthOfFrame + this.currentFrame * widthOfFrame,
            0,
            widthOfFrame,
            heightOfFrame,
            this.farXpos,
            this.yPos,
            this.width + 1,
            this.height
          );
          s2pd.ctx.drawImage(
            this.theImage,
            this.animations[this.currentAnimation][1] * widthOfFrame + this.currentFrame * widthOfFrame,
            0,
            widthOfFrame,
            heightOfFrame,
            this.width * 2 + this.xPos,
            this.yPos,
            this.width + 1,
            this.height
          );
          s2pd.ctx.drawImage(
            this.theImage,
            this.animations[this.currentAnimation][1] * widthOfFrame + this.currentFrame * widthOfFrame,
            0,
            widthOfFrame,
            heightOfFrame,
            this.width * 3 + this.xPos,
            this.yPos,
            this.width + 1,
            this.height
          );

          if (this.xPos <= leftOvers * -1) {
            this.xPos = (this.width * 2 - s2pd.width) * -1;
          }

          if (this.xPos >= 0) {
            s2pd.ctx.drawImage(
              this.theImage,
              this.animations[this.currentAnimation][1] * widthOfFrame + this.currentFrame * widthOfFrame,
              0,
              widthOfFrame,
              heightOfFrame,
              this.xPos - this.width,
              this.yPos,
              this.width + 1,
              this.height
            );
            if (this.xPos >= this.width) {
              this.xPos = 0;
              s2pd.ctx.drawImage(
                this.theImage,
                this.animations[this.currentAnimation][1] * widthOfFrame + this.currentFrame * widthOfFrame,
                0,
                widthOfFrame,
                heightOfFrame,
                this.xPos,
                this.yPos,
                this.width + 1,
                this.height
              );
            }
          }
        }

        if (this.width >= s2pd.width) {
          this.farXpos = this.xPos + this.width;

          s2pd.ctx.drawImage(
            this.theImage,
            this.animations[this.currentAnimation][1] * widthOfFrame + this.currentFrame * widthOfFrame,
            0,
            widthOfFrame,
            heightOfFrame,
            this.xPos,
            this.yPos,
            this.width + 1,
            this.height
          );

          if (this.farXpos <= s2pd.width) {
            s2pd.ctx.drawImage(
              this.theImage,
              this.animations[this.currentAnimation][1] * widthOfFrame + this.currentFrame * widthOfFrame,
              0,
              widthOfFrame,
              heightOfFrame,
              this.farXpos,
              this.yPos,
              this.width + 1,
              this.height
            );
            if (this.farXpos <= s2pd.width - s2pd.width) {
              this.xPos = 0;
            }
          }

          if (this.xPos >= 0) {
            s2pd.ctx.drawImage(
              this.theImage,
              this.animations[this.currentAnimation][1] * widthOfFrame + this.currentFrame * widthOfFrame,
              0,
              widthOfFrame,
              heightOfFrame,
              this.xPos - this.width,
              this.yPos,
              this.width + 1,
              this.height
            );
            if (this.xPos >= this.width) {
              this.xPos = 0;
              s2pd.ctx.drawImage(
                this.theImage,
                this.animations[this.currentAnimation][1] * widthOfFrame + this.currentFrame * widthOfFrame,
                0,
                widthOfFrame,
                heightOfFrame,
                this.xPos,
                this.yPos,
                this.width + 1,
                this.height
              );
            }
          }
        }
      }

      s2pd.ctx.globalAlpha = 1;
      if (this.jumping) {
        this.jumpFrames += 1;
        if (this.jumpFrames > 0 && this.jumpFrames <= 5) {
          this.yPos -= this.jumpHeight / 10;
        }
        if (this.jumpFrames > 5 && this.jumpFrames <= 11) {
          this.yPos -= this.jumpHeight / 20;
        }
        if (this.jumpFrames > 11 && this.jumpFrames <= 15) {
          this.yPos -= this.jumpHeight / 25;
        }
        if (this.jumpFrames > 15 && this.jumpFrames <= 17) {
          this.yPos -= this.jumpHeight / 50;
        }
        if (this.jumpFrames > 17 && this.jumpFrames <= 19) {
          this.yPos += this.jumpHeight / 50;
        }
        if (this.jumpFrames > 19 && this.jumpFrames <= 23) {
          this.yPos += this.jumpHeight / 25;
        }
        if (this.jumpFrames > 23 && this.jumpFrames <= 29) {
          this.yPos += this.jumpHeight / 20;
        }
        if (this.jumpFrames > 29 && this.jumpFrames <= 34) {
          this.yPos += this.jumpHeight / 10;
        }
        if (this.jumpFrames >= 35) {
          this.jumping = false;
          this.jumpFrames = 0;
          this.jumpCompleted = true;
        }
      }

      this.timeThroughLoop += 1;
    }
    makeScrollable() {
      this.scrolling = true;
    }
    addAnimation(name, startFrame, numberOfFrames) {
      this.animations.push([name, startFrame, numberOfFrames]);
    }
    changeAnimationTo(name) {
      for (let i = 0; i < this.animations.length; i++) {
        if (this.animations[i][0] === name) {
          this.currentAnimation = i;
        }
      }
    }

    control(speedX, speedY) {
      this.xPos += speedX;
      this.yPos += speedY;
    }
    jump(howMuch) {
      this.jumpHeight = howMuch;
      this.jumpFrames = 0;
      this.jumping = true;
    }
    moveTo(newX, newY) {
      this.xPos = newX;
      this.yPos = newY;
    }
    stop() {
      this.velX = 0;
      this.velY = 0;
    }
    updatePos() {
      s2pd.allBackgrounds[this.id] = this;
      this.xPos += this.velX;
      this.yPos += this.velY;
    }
    autoSize() {
      let increaceToWidth = s2pd.height / this.height;
      this.height = s2pd.height;
      this.width = increaceToWidth * this.width;
      this.farXpos = this.xPos + s2pd.width;
    }
    updateSize(howMuch) {
      if (howMuch < 0) {
        if (this.width > howMuch * -1) {
          this.width *= howMuch;
          this.farXpos = this.xPos + this.width;
          this.newFarXpos = this.farXpos + this.width;
        }
        if (this.height > howMuch * -1) {
          this.height *= howMuch;
        }
      } else {
        this.width *= howMuch;
        this.height *= howMuch;
      }
      this.farXpos = this.xPos + this.width;
      this.newFarXpos = this.farXpos + this.width;
    }
    updateOpacity(howMuch) {
      if (howMuch < 0) {
        if (this.opacity > howMuch * -1) {
          this.opacity += howMuch;
        }
      } else {
        this.opacity += howMuch;
      }
    }
    destroy() {
      s2pd.allBackgrounds.splice(this.id, 1);
    }
  },

  // ***********************TEXT*****************************

  Text: class {
    constructor(name, text, xPos, yPos, font, size, color, thickness, innerColor) {
      this.name = name;
      this.text = text;
      this.xPos = xPos;
      this.yPos = yPos;
      this.font = font;
      this.size = size;
      this.color = color;
      this.thickness = thickness;
      this.innerColor = innerColor;
      this.width = 0;
      this.height = 0;
      this.velX = 0;
      this.velY = 0;
      this.clickable = false;
      this.clicked = false;
      this.colorKey = '';
      this.opacity = 1;
      this.jumping = false;
      this.jumpFrames = 0;
      this.jumpCompleted = false;
      this.jumpHeight = 0;
      this.draggable = false;
      this.dragging = false;
      this.bindable = false;
      this.deadOutsideCanvas = false;
      this.detectHit = false;
      this.hitBoxX = this.xPos;
      this.hitBoxY = this.yPos - this.size;
      this.hitBoxWidth = 0;
      this.hitBoxHeight = 0;
      this.hitBoxId = undefined;
      this.clickableId = 0;
      this.draggableId = 0;
      this.holdableId = 0;
      this.holdable = false;
      this.holdDown = false;
      this.id = 0;
      this.timeStamp = Date.now();
      this.triggeredOnce = false;
      this.mouseDowned = false;

      // text wrapping stuff
      this.wrapText = false;
      this.letterArray = [];
      this.longestLineLength = 0;
      this.longestLine = 0;
      this.wordArray = [];
      this.lineArray = [];
      this.howManyTimesLongerThanScreenIsText = undefined;
      this.leading = 1.1;
      this.rightLimit = s2pd.width;
      this.makeArray();
    }
    makeArray() {
      for (let letter of this.text) {
        this.letterArray.push(letter);
      }
      this.wordArray = this.text.split(' ');
      this.lineArray = this.text.split('<br>');
      for (let i = 0; i < this.lineArray.length; i++) {
        if (this.lineArray[i].length > this.longestLineLength) {
          this.longestLineLength = this.lineArray[i].length;
          this.longestLine = i;
        }
      }
      this.make();
    }
    make() {
      if (!this.wrapText) {
        let increasingY = this.yPos;
        if (typeof this.thickness === 'number') {
          if (typeof this.innerColor === 'string') {
            s2pd.ctx.globalAlpha = this.opacity;
            s2pd.ctx.font = `${this.size}px ${this.font}`;
            s2pd.ctx.strokeStyle = this.color;
            s2pd.ctx.fillStyle = this.innerColor;
            s2pd.ctx.lineWidth = this.thickness;
            for (let i = 0; i < this.lineArray.length; i++) {
              s2pd.ctx.fillText(this.lineArray[i], this.xPos, increasingY);
              s2pd.ctx.strokeText(this.lineArray[i], this.xPos, increasingY);
              increasingY += this.size * this.leading;
            }
            this.width = s2pd.ctx.measureText(this.lineArray[this.longestLine]).width;
            this.height = this.size * this.leading * (this.lineArray.length + 1);

            this.hitBoxWidth = this.width;
            this.hitBoxHeight = this.height;
            s2pd.ctx.globalAlpha = 1;
          } else {
            s2pd.ctx.globalAlpha = this.opacity;
            s2pd.ctx.font = `${this.size}px ${this.font}`;
            s2pd.ctx.strokeStyle = this.color;
            s2pd.ctx.lineWidth = this.thickness;
            for (let i = 0; i < this.lineArray.length; i++) {
              s2pd.ctx.strokeText(this.lineArray[i], this.xPos, increasingY);
              increasingY += this.size * this.leading;
            }
            this.width = s2pd.ctx.measureText(this.lineArray[this.longestLine]).width;
            this.height = this.size * this.leading * (this.lineArray.length + 1);

            this.hitBoxWidth = this.width;
            this.hitBoxHeight = this.height;
            s2pd.ctx.globalAlpha = 1;
          }
        } else {
          s2pd.ctx.globalAlpha = this.opacity;
          s2pd.ctx.fillStyle = this.color;
          s2pd.ctx.font = `${this.size}px ${this.font}`;
          for (let i = 0; i < this.lineArray.length; i++) {
            s2pd.ctx.fillText(this.lineArray[i], this.xPos, increasingY);
            increasingY += this.size * this.leading;
          }
          this.width = s2pd.ctx.measureText(this.lineArray[this.longestLine]).width;
          this.height = this.size * this.leading * (this.lineArray.length + 1);

          this.hitBoxWidth = this.width;
          this.hitBoxHeight = this.height;
          s2pd.ctx.globalAlpha = 1;
        }

        if (this.jumping) {
          this.jumpFrames += 1;
          if (this.jumpFrames > 0 && this.jumpFrames <= 5) {
            this.yPos -= this.jumpHeight / 10;
          }
          if (this.jumpFrames > 5 && this.jumpFrames <= 11) {
            this.yPos -= this.jumpHeight / 20;
          }
          if (this.jumpFrames > 11 && this.jumpFrames <= 15) {
            this.yPos -= this.jumpHeight / 25;
          }
          if (this.jumpFrames > 15 && this.jumpFrames <= 17) {
            this.yPos -= this.jumpHeight / 50;
          }
          if (this.jumpFrames > 17 && this.jumpFrames <= 19) {
            this.yPos += this.jumpHeight / 50;
          }
          if (this.jumpFrames > 19 && this.jumpFrames <= 23) {
            this.yPos += this.jumpHeight / 25;
          }
          if (this.jumpFrames > 23 && this.jumpFrames <= 29) {
            this.yPos += this.jumpHeight / 20;
          }
          if (this.jumpFrames > 29 && this.jumpFrames <= 34) {
            this.yPos += this.jumpHeight / 10;
          }
          if (this.jumpFrames >= 35) {
            this.jumping = false;
            this.jumpFrames = 0;
            this.jumpCompleted = true;
          }
        }
      } else {
        if (typeof this.thickness === 'number') {
          let increasingX = this.xPos;
          let increasingY = this.yPos;
          let lengthOfLastWord = 0;
          let lengthOfNextWord = 0;
          let lengthOfSpace = 0;
          let howManyRows = 0;

          if (typeof this.innerColor === 'string') {
            for (let i = 0; i < this.wordArray.length; i++) {
              s2pd.ctx.globalAlpha = this.opacity;
              s2pd.ctx.font = `${this.size}px ${this.font}`;
              s2pd.ctx.strokeStyle = this.color;
              s2pd.ctx.fillStyle = this.innerColor;
              s2pd.ctx.lineWidth = this.thickness;
              s2pd.ctx.fillText(this.wordArray[i], increasingX, increasingY);
              s2pd.ctx.strokeText(this.wordArray[i], increasingX, increasingY);
              lengthOfLastWord = s2pd.ctx.measureText(this.wordArray[i]).width;
              lengthOfNextWord = s2pd.ctx.measureText(this.wordArray[i + 1]).width;
              lengthOfSpace = s2pd.ctx.measureText(' ').width;
              this.width = this.rightLimit - this.xPos;
              this.hitBoxWidth = this.width;
              this.hitBoxHeight = this.height;
              s2pd.ctx.globalAlpha = 1;
              if (increasingX < this.rightLimit - lengthOfNextWord) {
                increasingX += lengthOfLastWord + lengthOfSpace;
              }
              if (increasingX >= this.rightLimit - lengthOfNextWord) {
                howManyRows += 1;
                increasingX = this.xPos;
                increasingY += this.size * this.leading;
              }
              if (i === this.wordArray.length - 1) {
                this.height = Math.ceil(this.size * (howManyRows * this.leading));
              }
            }
          } else {
            for (let i = 0; i < this.wordArray.length; i++) {
              s2pd.ctx.globalAlpha = this.opacity;
              s2pd.ctx.font = `${this.size}px ${this.font}`;
              s2pd.ctx.strokeStyle = this.color;
              s2pd.ctx.lineWidth = this.thickness;
              s2pd.ctx.strokeText(this.wordArray[i], increasingX, increasingY);
              lengthOfLastWord = s2pd.ctx.measureText(this.wordArray[i]).width;
              lengthOfNextWord = s2pd.ctx.measureText(this.wordArray[i + 1]).width;
              lengthOfSpace = s2pd.ctx.measureText(' ').width;
              this.width = this.rightLimit - this.xPos;
              this.hitBoxWidth = this.width;
              this.hitBoxHeight = this.height;
              s2pd.ctx.globalAlpha = 1;
              if (increasingX < this.rightLimit - lengthOfNextWord) {
                increasingX += lengthOfLastWord + lengthOfSpace;
              }
              if (increasingX >= this.rightLimit - lengthOfNextWord) {
                howManyRows += 1;
                increasingX = this.xPos;
                increasingY += this.size * this.leading;
              }
              if (i === this.wordArray.length - 1) {
                this.height = Math.ceil(this.size * (howManyRows * this.leading));
              }
            }
          }
        } else {
          let increasingX = this.xPos;
          let increasingY = this.yPos;
          let lengthOfLastWord = 0;
          let lengthOfNextWord = 0;
          let lengthOfSpace = 0;
          let howManyRows = 0;
          for (let i = 0; i < this.wordArray.length; i++) {
            s2pd.ctx.globalAlpha = this.opacity;
            s2pd.ctx.fillStyle = this.color;
            s2pd.ctx.font = `${this.size}px ${this.font}`;
            s2pd.ctx.fillText(this.wordArray[i], increasingX, increasingY);
            lengthOfLastWord = s2pd.ctx.measureText(this.wordArray[i]).width;
            lengthOfNextWord = s2pd.ctx.measureText(this.wordArray[i + 1]).width;
            lengthOfSpace = s2pd.ctx.measureText(' ').width;
            this.width = this.rightLimit - this.xPos;

            this.hitBoxWidth = this.width;
            this.hitBoxHeight = this.height;
            s2pd.ctx.globalAlpha = 1;

            if (increasingX < this.rightLimit - lengthOfNextWord) {
              increasingX += lengthOfLastWord + lengthOfSpace;
            }
            if (increasingX >= this.rightLimit - lengthOfNextWord) {
              howManyRows += 1;
              increasingX = this.xPos;
              increasingY += this.size * this.leading;
            }
            if (i === this.wordArray.length - 1) {
              this.height = Math.ceil(this.size * (howManyRows * this.leading));
            }
          }
        }

        if (this.jumping) {
          this.jumpFrames += 1;
          if (this.jumpFrames > 0 && this.jumpFrames <= 5) {
            this.yPos -= this.jumpHeight / 10;
          }
          if (this.jumpFrames > 5 && this.jumpFrames <= 11) {
            this.yPos -= this.jumpHeight / 20;
          }
          if (this.jumpFrames > 11 && this.jumpFrames <= 15) {
            this.yPos -= this.jumpHeight / 25;
          }
          if (this.jumpFrames > 15 && this.jumpFrames <= 17) {
            this.yPos -= this.jumpHeight / 50;
          }
          if (this.jumpFrames > 17 && this.jumpFrames <= 19) {
            this.yPos += this.jumpHeight / 50;
          }
          if (this.jumpFrames > 19 && this.jumpFrames <= 23) {
            this.yPos += this.jumpHeight / 25;
          }
          if (this.jumpFrames > 23 && this.jumpFrames <= 29) {
            this.yPos += this.jumpHeight / 20;
          }
          if (this.jumpFrames > 29 && this.jumpFrames <= 34) {
            this.yPos += this.jumpHeight / 10;
          }
          if (this.jumpFrames >= 35) {
            this.jumping = false;
            this.jumpFrames = 0;
            this.jumpCompleted = true;
          }
        }
      }
    }
    hitDetect() {
      this.detectHit = true;
      this.hitBoxId = s2pd.hitDetectObjects.length;
      s2pd.hitDetectObjects.push(this);
    }
    makeClickable() {
      this.clickable = true;
      this.draggable = false;
      this.clickableId = s2pd.clickableObjects.length;
      s2pd.clickableObjects.push(this);
    }
    makeDraggable() {
      this.draggable = true;
      this.clickable = false;
      this.draggableId = s2pd.draggableObjects.length;
      s2pd.draggableObjects.push(this);
    }
    makeHoldable() {
      this.holdable = true;
      this.clickable = false;
      this.draggable = false;
      this.holdableId = s2pd.holdableObjects.length;
      s2pd.holdableObjects.push(this);
    }
    wrap() {
      this.wrapText = true;
    }
    control(speedX, speedY) {
      this.xPos += speedX;
      this.yPos += speedY;
    }
    jump(howMuch) {
      this.jumpHeight = howMuch;
      this.jumpFrames = 0;
      this.jumping = true;
    }
    moveTo(newX, newY) {
      this.xPos = newX;
      this.yPos = newY;
    }
    stop() {
      this.velX = 0;
      this.velY = 0;
    }
    bindToCanvas() {
      this.bindable = true;
    }
    destroyOutsideCanvas() {
      this.deadOutsideCanvas = true;
    }
    updatePos() {
      s2pd.allGameObjects[this.id] = this;
      this.hitBoxX = this.xPos;
      this.hitBoxY = this.yPos - this.size;
      this.hitBoxWidth = this.width;
      this.hitBoxHeight = this.height / 2;
      if (this.bindable) {
        if (this.xPos <= 0) {
          this.velX = -this.velX;
        }
        if (this.xPos >= s2pd.width - this.width) {
          this.velX = -this.velX;
        }
        if (this.yPos <= this.height) {
          this.velY = -this.velY;
        }
        if (this.yPos >= s2pd.height) {
          this.velY = -this.velY;
        }
      }

      if (this.deadOutsideCanvas) {
        if (this.xPos <= s2pd.randomBetween(this.width * -10, this.width * -2)) {
          this.destroy();
        }
        if (this.xPos >= s2pd.randomBetween(s2pd.width + this.width * 2, s2pd.width + this.width * 10)) {
          this.destroy();
        }
        if (this.yPos <= s2pd.randomBetween(this.height * -10, this.height * -2)) {
          this.destroy();
        }
        if (this.yPos >= s2pd.randomBetween(s2pd.height + this.height * 2, s2pd.height + this.height * 10)) {
          this.destroy();
        }
      }
      if (this.dragging === true) {
        s2pd.dragArray[0] = this;
        if (s2pd.draggingWithMouse) {
          this.xPos = s2pd.mouseX - this.width / 2;
          this.yPos = s2pd.mouseY + this.height / 4;
        } else {
          this.xPos = s2pd.touchMoveX - this.width / 2;
          this.yPos = s2pd.touchMoveY + this.height / 4;
        }
      } else {
        this.xPos += this.velX;
        this.yPos += this.velY;
        if (this.detectHit) {
          this.hitBoxX = this.xPos;
          this.hitBoxY = this.yPos - this.size;
          this.hitBoxWidth = this.width;
          this.hitBoxHeight = this.height;
          s2pd.hitDetectObjects[this.hitBoxId] = this;
        }
      }
    }
    updateSize(howMuch) {
      if (howMuch < 0) {
        if (this.size > howMuch * -1) {
          this.size = howMuch;
        }
      } else {
        this.size = howMuch;
        this.size = howMuch;
      }
    }
    updateOpacity(howMuch) {
      this.opacity = howMuch;
    }

    destroy() {
      if (this.clickable) {
        s2pd.clickableObjects.splice(this.clickableId, 1);
      }
      if (this.detectHit) {
        s2pd.hitDetectObjects.splice(this.hitBoxId, 1);
        for (let i = 0; i < s2pd.hitDetectObjects.length; i++) {
          s2pd.hitDetectObjects[i].hitBoxId = i;
        }
      }

      s2pd.allGameObjects.splice(this.id, 1);
    }
  },

  Circle: class {
    constructor(name, xPos, yPos, radius, color, thickness) {
      this.name = name;
      this.xPos = xPos;
      this.yPos = yPos;
      this.radius = radius;
      this.color = color;
      this.thickness = thickness;
      this.velX = 0;
      this.velY = 0;
      this.clickable = false;
      this.clicked = false;
      this.colorKey = '';
      this.opacity = 1;
      this.outlineSwitch = false;
      this.outlineThickness = 0;
      this.outlineColor = 'rgb(0,0,0)';
      this.jumping = false;
      this.jumpFrames = 0;
      this.jumpCompleted = false;
      this.jumpHeight = 0;
      this.draggable = false;
      this.dragging = false;
      this.bindable = false;
      this.deadOutsideCanvas = false;
      this.detectHit = false;
      this.hitBoxX = this.xPos - this.radius;
      this.hitBoxY = this.yPos - this.radius;
      this.hitBoxWidth = this.radius * 2;
      this.hitBoxHeight = this.radius * 2;
      this.hitBoxId = undefined;
      this.clickableId = 0;
      this.draggableId = 0;
      this.holdableId = 0;
      this.holdable = false;
      this.holdDown = false;
      this.id = 0;
      this.timeStamp = Date.now();
      this.triggeredOnce = false;
      this.mouseDowned = false;

      this.make();
    }

    make() {
      this.hitBoxWidth = this.radius * 2;
      this.hitBoxHeight = this.radius * 2;
      this.hitBoxX = this.xPos - this.radius;
      this.hitBoxY = this.yPos - this.radius;
      if (typeof this.thickness === 'number') {
        s2pd.ctx.beginPath();
        s2pd.ctx.globalAlpha = this.opacity;
        s2pd.ctx.strokeStyle = this.color;
        s2pd.ctx.lineWidth = this.thickness;
        s2pd.ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
        s2pd.ctx.stroke();
        s2pd.ctx.globalAlpha = 1;
      } else {
        s2pd.ctx.beginPath();
        s2pd.ctx.globalAlpha = this.opacity;
        s2pd.ctx.fillStyle = this.color;
        s2pd.ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
        s2pd.ctx.fill();
        s2pd.ctx.globalAlpha = 1;
        if (this.outlineSwitch) {
          s2pd.ctx.strokeStyle = this.outlineColor;
          s2pd.ctx.lineWidth = this.outlineThickness;
          s2pd.ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
          s2pd.ctx.stroke();
        }
      }
      if (this.jumping) {
        this.jumpFrames += 1;
        if (this.jumpFrames > 0 && this.jumpFrames <= 5) {
          this.yPos -= this.jumpHeight / 10;
        }
        if (this.jumpFrames > 5 && this.jumpFrames <= 11) {
          this.yPos -= this.jumpHeight / 20;
        }
        if (this.jumpFrames > 11 && this.jumpFrames <= 15) {
          this.yPos -= this.jumpHeight / 25;
        }
        if (this.jumpFrames > 15 && this.jumpFrames <= 17) {
          this.yPos -= this.jumpHeight / 50;
        }
        if (this.jumpFrames > 17 && this.jumpFrames <= 19) {
          this.yPos += this.jumpHeight / 50;
        }
        if (this.jumpFrames > 19 && this.jumpFrames <= 23) {
          this.yPos += this.jumpHeight / 25;
        }
        if (this.jumpFrames > 23 && this.jumpFrames <= 29) {
          this.yPos += this.jumpHeight / 20;
        }
        if (this.jumpFrames > 29 && this.jumpFrames <= 34) {
          this.yPos += this.jumpHeight / 10;
        }
        if (this.jumpFrames >= 35) {
          this.jumping = false;
          this.jumpFrames = 0;
          this.jumpCompleted = true;
        }
      }
    }
    hitDetect() {
      this.detectHit = true;
      this.hitBoxId = s2pd.hitDetectObjects.length;
      s2pd.hitDetectObjects.push(this);
    }
    makeClickable() {
      this.clickable = true;
      this.draggable = false;
      this.clickableId = s2pd.clickableObjects.length;
      s2pd.clickableObjects.push(this);
    }
    makeDraggable() {
      this.draggable = true;
      this.clickable = false;
      this.draggableId = s2pd.draggableObjects.length;
      s2pd.draggableObjects.push(this);
    }
    makeHoldable() {
      this.holdable = true;
      this.clickable = false;
      this.draggable = false;
      this.holdableId = s2pd.holdableObjects.length;
      s2pd.holdableObjects.push(this);
    }
    control(speedX, speedY) {
      this.xPos += speedX;
      this.yPos += speedY;
    }
    moveTo(newX, newY) {
      this.xPos = newX;
      this.yPos = newY;
    }
    stop() {
      this.velX = 0;
      this.velY = 0;
    }
    jump(howMuch) {
      this.jumpHeight = howMuch;
      this.jumpFrames = 0;
      this.jumping = true;
    }
    bindToCanvas() {
      this.bindable = true;
    }
    destroyOutsideCanvas() {
      this.deadOutsideCanvas = true;
    }
    updatePos() {
      s2pd.allGameObjects[this.id] = this;
      if (this.bindable) {
        if (this.xPos <= this.radius) {
          this.velX = -this.velX;
        }
        if (this.xPos >= s2pd.width - this.radius) {
          this.velX = -this.velX;
        }
        if (this.yPos <= this.radius) {
          this.velY = -this.velY;
        }
        if (this.yPos >= s2pd.height - this.radius) {
          this.velY = -this.velY;
        }
      }
      if (this.deadOutsideCanvas) {
        if (this.xPos <= s2pd.randomBetween(this.radius * -10, this.radius * -2)) {
          this.destroy();
        }
        if (this.xPos >= s2pd.randomBetween(s2pd.width + this.radius * 2, s2pd.width + this.radius * 10)) {
          this.destroy();
        }
        if (this.yPos <= s2pd.randomBetween(this.radius * -10, this.radius * -2)) {
          this.destroy();
        }
        if (this.yPos >= s2pd.randomBetween(s2pd.height + this.radius * 2, s2pd.height + this.radius * 10)) {
          this.destroy();
        }
      }
      if (this.dragging === true) {
        s2pd.dragArray[0] = this;
        if (s2pd.draggingWithMouse) {
          this.xPos = s2pd.mouseX;
          this.yPos = s2pd.mouseY;
        } else {
          this.xPos = s2pd.touchMoveX;
          this.yPos = s2pd.touchMoveY;
        }
      } else {
        this.xPos += this.velX;
        this.yPos += this.velY;
        if (this.detectHit) {
          this.hitBoxX = this.xPos - this.radius;
          this.hitBoxY = this.yPos - this.radius;
          this.hitBoxWidth = this.radius * 2;
          this.hitBoxHeight = this.radius * 2;
          s2pd.hitDetectObjects[this.hitBoxId] = this;
        }
      }
    }
    updateSize(howMuch) {
      if (this.radius + howMuch > 0) {
        this.radius += howMuch;
      }
    }
    updateOpacity(howMuch) {
      if (howMuch < 0) {
        if (this.opacity > howMuch * -1) {
          this.opacity += howMuch;
        }
      } else {
        this.opacity += howMuch;
      }
    }
    updateColor(r, g, b, keepTrack) {
      keepTrack = [];
      keepTrack.push(r);
      keepTrack.push(g);
      keepTrack.push(b);
      keepTrack.forEach((element) => {
        if (element < 0) {
          element = 0;
        }
        if (element > 255) {
          element = 255;
        }
      });

      this.color = `rgb(${r},${g},${b})`;
    }
    updateThickness(howMuch) {
      if (howMuch < 0) {
        if (this.thickness > howMuch * -1) {
          this.thickness += howMuch;
        }
      } else {
        this.thickness += howMuch;
      }
    }
    addOutline(color, thickness) {
      this.outlineSwitch = true;
      this.outlineColor = color;
      this.outlineThickness = thickness;
    }
    destroy() {
      if (this.clickable) {
        s2pd.clickableObjects.splice(this.clickableId, 1);
      }
      if (this.detectHit) {
        s2pd.hitDetectObjects.splice(this.hitBoxId, 1);
        for (let i = 0; i < s2pd.hitDetectObjects.length; i++) {
          s2pd.hitDetectObjects[i].hitBoxId = i;
        }
      }

      s2pd.allGameObjects.splice(this.id, 1);
    }
  },

  Rectangle: class {
    constructor(name, xPos, yPos, width, height, color, thickness) {
      this.name = name;
      this.xPos = xPos;
      this.yPos = yPos;
      this.wxPos = xPos + width;
      this.hyPos = yPos + height;
      this.width = width;
      this.height = height;
      this.color = color;
      this.velX = 0;
      this.velY = 0;
      this.thickness = thickness;

      this.clickable = false;
      this.clicked = false;
      this.colorKey = '';
      this.opacity = 1;
      this.outlineSwitch = false;
      this.outlineThickness = 0;
      this.outlineColor = 'rgb(0,0,0)';
      this.jumping = false;
      this.jumpFrames = 0;
      this.jumpCompleted = false;
      this.jumpHeight = 0;
      this.draggable = false;
      this.dragging = false;
      this.bindable = false;
      this.deadOutsideCanvas = false;
      this.detectHit = false;
      this.hitBoxX = this.xPos;
      this.hitBoxY = this.yPos;
      this.hitBoxWidth = this.width;
      this.hitBoxHeight = this.height;
      this.hitBoxId = undefined;
      this.clickableId = 0;
      this.draggableId = 0;
      this.holdableId = 0;
      this.holdable = false;
      this.holdDown = false;
      this.id = 0;
      this.timeStamp = Date.now();
      this.triggeredOnce = false;
      this.mouseDowned = false;

      this.make();
    }

    make() {
      this.hitBoxX = this.xPos;
      this.hitBoxY = this.yPos;
      this.hitBoxWidth = this.width;
      this.hitBoxHeight = this.height;
      if (typeof this.thickness === 'number') {
        s2pd.ctx.globalAlpha = this.opacity;
        s2pd.ctx.strokeStyle = this.color;
        s2pd.ctx.lineWidth = this.thickness;
        s2pd.ctx.strokeRect(this.xPos, this.yPos, this.width, this.height);
        s2pd.ctx.globalAlpha = 1;
      } else {
        s2pd.ctx.globalAlpha = this.opacity;
        s2pd.ctx.fillStyle = this.color;
        s2pd.ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
        s2pd.ctx.globalAlpha = 1;
        if (this.outlineSwitch) {
          s2pd.ctx.globalAlpha = this.opacity;
          s2pd.ctx.strokeStyle = this.outlineColor;
          s2pd.ctx.lineWidth = this.outlineThickness;
          s2pd.ctx.strokeRect(this.xPos, this.yPos, this.width, this.height);
          s2pd.ctx.globalAlpha = 1;
        }
      }
      if (this.jumping) {
        this.jumpFrames += 1;
        if (this.jumpFrames > 0 && this.jumpFrames <= 5) {
          this.yPos -= this.jumpHeight / 10;
        }
        if (this.jumpFrames > 5 && this.jumpFrames <= 11) {
          this.yPos -= this.jumpHeight / 20;
        }
        if (this.jumpFrames > 11 && this.jumpFrames <= 15) {
          this.yPos -= this.jumpHeight / 25;
        }
        if (this.jumpFrames > 15 && this.jumpFrames <= 17) {
          this.yPos -= this.jumpHeight / 50;
        }
        if (this.jumpFrames > 17 && this.jumpFrames <= 19) {
          this.yPos += this.jumpHeight / 50;
        }
        if (this.jumpFrames > 19 && this.jumpFrames <= 23) {
          this.yPos += this.jumpHeight / 25;
        }
        if (this.jumpFrames > 23 && this.jumpFrames <= 29) {
          this.yPos += this.jumpHeight / 20;
        }
        if (this.jumpFrames > 29 && this.jumpFrames <= 34) {
          this.yPos += this.jumpHeight / 10;
        }
        if (this.jumpFrames >= 35) {
          this.jumping = false;
          this.jumpFrames = 0;
          this.jumpCompleted = true;
        }
      }
    }
    hitDetect() {
      this.detectHit = true;
      this.hitBoxId = s2pd.hitDetectObjects.length;
      s2pd.hitDetectObjects.push(this);
    }
    makeClickable() {
      this.clickable = true;
      this.draggable = false;
      this.clickableId = s2pd.clickableObjects.length;
      s2pd.clickableObjects.push(this);
    }
    makeDraggable() {
      this.draggable = true;
      this.clickable = false;
      this.draggableId = s2pd.draggableObjects.length;
      s2pd.draggableObjects.push(this);
    }
    makeHoldable() {
      this.holdable = true;
      this.clickable = false;
      this.draggable = false;
      this.holdableId = s2pd.holdableObjects.length;
      s2pd.holdableObjects.push(this);
    }
    control(speedX, speedY) {
      this.xPos += speedX;
      this.yPos += speedY;
    }
    moveTo(newX, newY) {
      this.xPos = newX;
      this.yPos = newY;
    }
    stop() {
      this.velX = 0;
      this.velY = 0;
    }
    jump(howMuch) {
      this.jumpHeight = howMuch;
      this.jumpFrames = 0;
      this.jumping = true;
    }
    bindToCanvas() {
      this.bindable = true;
    }
    destroyOutsideCanvas() {
      this.deadOutsideCanvas = true;
    }
    updatePos() {
      s2pd.allGameObjects[this.id] = this;
      if (this.bindable) {
        if (this.xPos <= 0) {
          this.velX = -this.velX;
        }
        if (this.xPos >= s2pd.width) {
          this.velX = -this.velX;
        }
        if (this.yPos <= 0) {
          this.velY = -this.velY;
        }
        if (this.yPos >= s2pd.height) {
          this.velY = -this.velY;
        }
      }
      if (this.deadOutsideCanvas) {
        if (this.xPos <= -this.width) {
          this.destroy();
        }
        if (this.xPos >= s2pd.width) {
          this.destroy();
        }
        if (this.yPos <= -this.height) {
          this.destroy();
        }
        if (this.yPos >= s2pd.height) {
          this.destroy();
        }
      }
      if (this.dragging === true) {
        s2pd.dragArray[0] = this;
        if (s2pd.draggingWithMouse) {
          this.xPos = s2pd.mouseX;
          this.yPos = s2pd.mouseY;
        } else {
          this.xPos = s2pd.touchMoveX;
          this.yPos = s2pd.touchMoveY;
        }
      } else {
        this.xPos += this.velX;
        this.yPos += this.velY;
        if (this.detectHit) {
          this.hitBoxX = this.xPos;
          this.hitBoxY = this.yPos;
          this.hitBoxWidth = this.width;
          this.hitBoxHeight = this.height;
          s2pd.hitDetectObjects[this.hitBoxId] = this;
        }
      }
    }
    updateSize(howMuch) {
      if (howMuch < 0) {
        if (this.width > howMuch * -1) {
          this.width *= howMuch;
        }
        if (this.height > howMuch * -1) {
          this.height *= howMuch;
        }
      } else {
        this.width *= howMuch;
        this.height *= howMuch;
      }
    }
    updateOpacity(howMuch) {
      if (howMuch < 0) {
        if (this.opacity > howMuch * -1) {
          this.opacity += howMuch;
        }
      } else {
        this.opacity = howMuch;
      }
    }
    updateColor(r, g, b, keepTrack) {
      keepTrack = [];
      keepTrack.push(r);
      keepTrack.push(g);
      keepTrack.push(b);
      keepTrack.forEach((element) => {
        if (element < 0) {
          element = 0;
        }
        if (element > 255) {
          element = 255;
        }
      });

      this.color = `rgb(${r},${g},${b})`;
    }
    updateThickness(howMuch) {
      if (howMuch < 0) {
        if (this.thickness > howMuch * -1) {
          this.thickness += howMuch;
        }
      } else {
        this.thickness += howMuch;
      }
    }
    addOutline(color, thickness) {
      this.outlineSwitch = true;
      this.outlineColor = color;
      this.outlineThickness = thickness;
    }
    destroy() {
      if (this.clickable) {
        s2pd.clickableObjects.splice(this.clickableId, 1);
      }
      if (this.detectHit) {
        s2pd.hitDetectObjects.splice(this.hitBoxId, 1);
        for (let i = 0; i < s2pd.hitDetectObjects.length; i++) {
          s2pd.hitDetectObjects[i].hitBoxId = i;
        }
      }

      s2pd.allGameObjects.splice(this.id, 1);
    }
  },

  Line: class {
    constructor(startX, startY, endX, endY, color, thickness) {
      this.startX = startX;
      this.startY = startY;
      this.endX = endX;
      this.endY = endY;
      this.color = color;
      this.velX = 0;
      this.velY = 0;
      this.thickness = thickness;
      this.make();
    }
    make() {
      s2pd.ctx.beginPath();
      s2pd.ctx.moveTo(this.startX, this.startY);
      s2pd.ctx.lineTo(this.endX, this.endY);
      s2pd.ctx.lineWidth = this.thickness;
      s2pd.ctx.strokeStyle = this.color;
      s2pd.ctx.stroke();
    }
    control(speedX, speedY) {
      this.startX += speedX;
      this.endX += speedX;
      this.startY += speedY;
      this.endY += speedY;
    }
    updatePos() {
      if (this.startX <= 0) {
        this.velX = -this.velX;
      }
      if (this.endX <= 0) {
        this.velX = -this.velX;
      }
      if (this.startX >= s2pd.width) {
        this.velX = -this.velX;
      }
      if (this.endX >= s2pd.width) {
        this.velX = -this.velX;
      }
      if (this.startY <= 0) {
        this.velY = -this.velY;
      }
      if (this.endY <= 0) {
        this.velY = -this.velY;
      }
      if (this.startY >= s2pd.height) {
        this.velY = -this.velY;
      }
      if (this.endY >= s2pd.height) {
        this.velY = -this.velY;
      }
      this.startX += this.velX;
      this.endX += this.velX;
      this.startY += this.velY;
      this.endY += this.velY;
    }
  },

  Ellipse: class {
    constructor(xPos, yPos, radiusX, radiusY, rotation, color, thickness) {
      this.xPos = xPos;
      this.yPos = yPos;
      this.radiusX = radiusX;
      this.radiusY = radiusY;
      this.rotation = rotation;
      this.color = color;
      this.velX = 0;
      this.velY = 0;
      this.thickness = thickness;
      this.make();
    }
    control(speedX, speedY) {
      this.xPos += speedX;
      this.yPos += speedY;
    }
    make() {
      if (typeof this.thickness === 'number') {
        s2pd.ctx.strokeStyle = this.color;
        s2pd.ctx.lineWidth = this.thickness;
        s2pd.ctx.beginPath();
        s2pd.ctx.ellipse(this.xPos, this.yPos, this.radiusX, this.radiusY, this.rotation, 0, 2 * Math.PI);
        s2pd.ctx.stroke();
      } else {
        s2pd.ctx.fillStyle = this.color;
        s2pd.ctx.beginPath();
        s2pd.ctx.ellipse(this.xPos, this.yPos, this.radiusX, this.radiusY, this.rotation, 0, 2 * Math.PI);
        s2pd.ctx.fill();
      }
    }
  },
  ////// *******************WEB AUDIO ***********************
  //////

  Sound: class {
    constructor(name, source, volume, playbackRate, detune, loop) {
      this.name = name;
      this.source = source;
      this.volume = volume;
      this.detune = detune;
      this.playbackRate = playbackRate;
      this.loop = loop;
      this.delayTime = 0;
      this.startTime = undefined;
      this.pauseTime = 0;
      this.pauseStartTime = 0;
      this.pauseDuration = 0;
      this.gainNode = undefined;
      this.distortionGainNode = undefined;
      this.distortionNode = undefined;
      this.distortionAmount = undefined;
      this.distortionOn = false;
      this.duration = undefined;
      this.delayNode = undefined;
      this.theSound = undefined;
      this.playSound = undefined;
      this.reverse = false;
      this.loaded = false;
      this.fileSize = 0;
      this.amountLoaded = 0;
      this.loaded = false;
      this.totallyLoaded = false;
      this.load();
    }
    load() {
      let getSound = new XMLHttpRequest();
      let theSound;
      let self = this;
      getSound.open('GET', this.source, true);
      getSound.responseType = 'arraybuffer';
      getSound.onload = function () {
        s2pd.audioContext.decodeAudioData(getSound.response, function (buffer) {
          theSound = buffer;
          self.theSound = theSound;
          self.loaded = true;
        });
      };
      getSound.addEventListener(
        'progress',
        function (evt) {
          if (evt.lengthComputable) {
            self.fileSize = evt.total;
            self.amountLoaded = evt.loaded;
          }
        },
        false
      );

      getSound.onloadend = function () {
        console.log(self.name + ' loaded');
        self.totallyLoaded = true;
        s2pd.loadedAudio.push(self);
      };
      getSound.send();
      s2pd.allAudioObjects.push(self);
    }
    play() {
      if (this.distortionOn) {
        this.playSound = s2pd.audioContext.createBufferSource();
        this.gainNode = s2pd.audioContext.createGain();
        this.delayNode = s2pd.audioContext.createDelay();
        this.distortionGainNode = s2pd.audioContext.createGain();
        this.distortionNode = s2pd.audioContext.createWaveShaper();
        this.distortionNode.curve = this.distortionCurve(this.distortionAmount);
        this.gainNode.gain.value = this.volume;
        this.delayNode.delayTime.setValueAtTime(this.delayTime, s2pd.audioContext.currentTime);
        this.playSound.buffer = this.theSound;
        this.playSound.connect(this.gainNode);
        this.gainNode.connect(this.distortionGainNode);
        this.distortionGainNode.connect(this.distortionNode);
        this.distortionNode.connect(this.delayNode);
        this.delayNode.connect(s2pd.audioContext.destination);
        this.playSound.playbackRate.value = this.playbackRate;
        this.playSound.detune.value = this.detune;
        this.playSound.start(0, this.pauseTime);
        this.duration = this.playSound.buffer.duration;
        this.startTime = Date.now();
        if (this.loop) {
          this.playSound.loop = true;
        }
      } else {
        this.playSound = s2pd.audioContext.createBufferSource();
        this.gainNode = s2pd.audioContext.createGain();
        this.delayNode = s2pd.audioContext.createDelay();
        this.gainNode.gain.value = this.volume;
        this.delayNode.delayTime.setValueAtTime(this.delayTime, s2pd.audioContext.currentTime);
        this.playSound.buffer = this.theSound;
        this.playSound.connect(this.gainNode);
        this.gainNode.connect(this.delayNode);
        this.delayNode.connect(s2pd.audioContext.destination);
        this.playSound.playbackRate.value = this.playbackRate;
        this.playSound.detune.value = this.detune;
        this.playSound.start(0, this.pauseTime);
        this.duration = this.playSound.buffer.duration;
        this.startTime = Date.now();
        if (this.loop) {
          this.playSound.loop = true;
        }
      }
    }
    stop() {
      this.playSound.stop();
    }
    pause() {
      this.pauseStartTime = Date.now();
      this.playSound.stop();
      this.pauseTime = (Date.now() - this.startTime) / 1000;
      let dividy = this.pauseTime / this.duration;
      this.pauseTime = this.duration * (dividy - Math.floor(dividy));
    }
    unpause() {
      if (this.distortionOn) {
        this.pauseDuration = Date.now() - this.pauseStartTime;
        this.startTime += this.pauseDuration;
        this.playSound = s2pd.audioContext.createBufferSource();
        this.gainNode = s2pd.audioContext.createGain();
        this.delayNode = s2pd.audioContext.createDelay();
        this.distortionGainNode = s2pd.audioContext.createGain();
        this.distortionNode = s2pd.audioContext.createWaveShaper();
        this.distortionNode.curve = this.distortionCurve(this.distortionAmount);
        this.gainNode.gain.value = this.volume;
        this.delayNode.delayTime.setValueAtTime(this.delayTime, s2pd.audioContext.currentTime);
        this.playSound.buffer = this.theSound;
        this.playSound.connect(this.gainNode);
        this.gainNode.connect(this.distortionGainNode);
        this.distortionGainNode.connect(this.distortionNode);
        this.distortionNode.connect(this.delayNode);
        this.delayNode.connect(s2pd.audioContext.destination);
        this.playSound.playbackRate.value = this.playbackRate;
        this.playSound.detune.value = this.detune;
        this.playSound.start(0, this.pauseTime);
        if (this.loop) {
          this.playSound.loop = true;
        }
      } else {
        this.pauseDuration = Date.now() - this.pauseStartTime;
        this.startTime += this.pauseDuration;
        this.playSound = s2pd.audioContext.createBufferSource();
        this.gainNode = s2pd.audioContext.createGain();
        this.delayNode = s2pd.audioContext.createDelay();
        this.gainNode.gain.value = this.volume;
        this.delayNode.delayTime.setValueAtTime(this.delayTime, s2pd.audioContext.currentTime);
        this.playSound.buffer = this.theSound;
        this.playSound.connect(this.gainNode);
        this.gainNode.connect(this.delayNode);
        this.delayNode.connect(s2pd.audioContext.destination);
        this.playSound.playbackRate.value = this.playbackRate;
        this.playSound.detune.value = this.detune;
        this.playSound.start(0, this.pauseTime);
        if (this.loop) {
          this.playSound.loop = true;
        }
      }
    }
    updateVolume(howMuch) {
      this.volume = howMuch;
      this.gainNode.gain.value = howMuch;
    }
    updatePlaybackRate(howMuch) {
      this.playbackRate = howMuch;
      this.playSound.playbackRate.value = howMuch;
    }
    updateDetune(howMuch) {
      this.detune = howMuch;
      this.playSound.detune.value = howMuch;
    }
    addDelay(delayTime, repetitions, length) {}
    updateDelay(howMuch) {
      this.delayTime = howMuch;
      this.delayNode.delayTime.setValueAtTime(howMuch, s2pd.audioContext.currentTime);
    }
    updateDistortion(howMuch) {
      this.distortionAmount = howMuch;
      this.distortionNode.curve = this.distortionCurve(howMuch);
    }
    cancelLoop() {
      this.playSound.loop = false;
      this.loop = false;
    }
    makeLoop() {
      this.playSound.loop = true;
      this.loop = true;
    }
    reverse() {
      this.reverse = true;
    }
    //distortionCurve(howMuch) {
    //  let k = howMuch,
    //    n_samples = typeof sampleRate === 'number' ? sampleRate : 44100,
    //    curve = new Float32Array(n_samples),
    //    deg = Math.PI / 180,
    //    i = 0,
    //    x;
    //  for (; i < n_samples; ++i) {
    //    x = (i * 2) / n_samples - 1;
    //    curve[i] =
    //      ((3 + k) * Math.atan(Math.sinh(x * 0.25) * 5)) /
    //      (Math.PI + k * Math.abs(x));
    //  }
    //  return curve;
    //}
    addDistortion(howMuch) {
      this.distortionOn = true;
      this.distortionAmount = howMuch;
    }
  },

  ///// ****************SYNTH****************

  Synth: class {
    constructor(name, waveForm, gain, delay) {
      this.name = name;
      this.waveForm = waveForm;
      this.gain = gain;
      this.delay = delay;
      this.playing = false;
      this.oscillator = undefined;
      this.gainNode = undefined;
      this.delayNode = undefined;
      this.distortionGainNode = undefined;
      this.distortionNode = undefined;
      this.distortionAmount = undefined;
      this.distortionOn = false;
    }
    play(frequency) {
      if (this.distortionOn) {
        this.oscillator = s2pd.audioContext.createOscillator();
        this.gainNode = s2pd.audioContext.createGain();
        this.delayNode = s2pd.audioContext.createDelay();
        this.convolverNode = s2pd.audioContext.createConvolver;
        this.distortionGainNode = s2pd.audioContext.createGain();
        this.distortionNode = s2pd.audioContext.createWaveShaper();
        this.distortionNode.curve = this.distortionCurve(this.distortionAmount);
        this.oscillator.frequency.setValueAtTime(frequency, s2pd.audioContext.currentTime);
        this.gainNode.gain.value = this.gain;
        this.delayNode.delayTime.setValueAtTime(this.delay, s2pd.audioContext.currentTime);
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.distortionGainNode);
        this.distortionGainNode.connect(this.distortionNode);
        this.distortionNode.connect(this.delayNode);
        this.delayNode.connect(s2pd.audioContext.destination);
        this.oscillator.start();
      } else {
        this.oscillator = s2pd.audioContext.createOscillator();
        this.gainNode = s2pd.audioContext.createGain();
        this.delayNode = s2pd.audioContext.createDelay();
        this.oscillator.frequency.setValueAtTime(frequency, s2pd.audioContext.currentTime);
        this.gainNode.gain.value = this.gain;
        this.delayNode.delayTime.setValueAtTime(this.delay, s2pd.audioContext.currentTime);
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.delayNode);
        this.delayNode.connect(s2pd.audioContext.destination);
        this.oscillator.start();
      }
    }
    stop() {
      this.oscillator.stop();
    }
    updateFrequency(frequency) {
      this.oscillator.frequency.setValueAtTime(frequency, s2pd.audioContext.currentTime);
    }
    updateGain(gain) {
      this.gainNode.gain.value = gain;
    }
    updateDelay(delay) {
      this.delayNode.delayTime.setValueAtTime(delay, s2pd.audioContext.currentTime);
    }
    updateDistortion(howMuch) {
      this.distortionAmount = howMuch;
      this.distortionNode.curve = this.distortionCurve(howMuch);
    }
    //    distortionCurve(howMuch) {
    //      let k = howMuch,
    //        n_samples = typeof sampleRate === 'number' ? sampleRate : 44100,
    //        curve = new Float32Array(n_samples),
    //        deg = Math.PI / 180,
    //        i = 0,
    //        x;
    //      for (; i < n_samples; ++i) {
    //        x = (i * 2) / n_samples - 1;
    //        curve[i] =
    //         ((3 + k) * Math.atan(Math.sinh(x * 0.25) * 5)) /
    //          (Math.PI + k * Math.abs(x));
    //      }
    //      return curve;
    //    }
    addDistortion(howMuch) {
      this.distortionOn = true;
      this.distortionAmount = howMuch;
    }
  },

  ////////**************CONTROLS******************* */

  ////////**************MOUSE METHODS******************* */
  mouseMove: function (event) {
    let canvasPos = s2pd.canvas.getBoundingClientRect();
    s2pd.mouseXcurrent = Math.floor(event.clientX - canvasPos.left);
    s2pd.mouseYcurrent = Math.floor(event.clientY - canvasPos.top);
    if (s2pd.dragStarted) {
      let canvasPos = s2pd.canvas.getBoundingClientRect();
      s2pd.mouseX = Math.floor(event.clientX - canvasPos.left);
      s2pd.mouseY = Math.floor(event.clientY - canvasPos.top);
    }
  },

  mouseDown: function (event) {
    if (s2pd.enableDragAndDrop) {
      let clickedObject;
      let draggableOrNot = false;
      let canvasPos = s2pd.canvas.getBoundingClientRect();
      s2pd.mouseX = Math.floor(event.clientX - canvasPos.left);
      s2pd.mouseY = Math.floor(event.clientY - canvasPos.top);
      for (let i = 0; i < s2pd.draggableObjects.length; i++) {
        if (
          s2pd.mouseX >= s2pd.draggableObjects[i].hitBoxX &&
          s2pd.mouseY >= s2pd.draggableObjects[i].hitBoxY &&
          s2pd.mouseX <= s2pd.draggableObjects[i].hitBoxX + s2pd.draggableObjects[i].hitBoxWidth &&
          s2pd.mouseY <= s2pd.draggableObjects[i].hitBoxY + s2pd.draggableObjects[i].hitBoxHeight
        ) {
          s2pd.dragStarted = true;
          draggableOrNot = true;
          s2pd.draggingWithMouse = true;
          if (draggableOrNot) {
            clickedObject = s2pd.draggableObjects[i];
            clickedObject.dragging = true;
          }
        }
      }
      for (let i = 0; i < s2pd.holdableObjects.length; i++) {
        if (
          s2pd.mouseX >= s2pd.holdableObjects[i].hitBoxX &&
          s2pd.mouseY >= s2pd.holdableObjects[i].hitBoxY &&
          s2pd.mouseX <= s2pd.holdableObjects[i].hitBoxX + s2pd.holdableObjects[i].hitBoxWidth &&
          s2pd.mouseY <= s2pd.holdableObjects[i].hitBoxY + s2pd.holdableObjects[i].hitBoxHeight
        ) {
          s2pd.holdStarted = true;
          clickedObject = s2pd.holdableObjects[i];
          clickedObject.holdDown = true;
          onBeingHeldDown(clickedObject);
        }
      }
    }
  },

  mouseUp: function () {
    if (s2pd.dragStarted) {
      s2pd.dragStarted = false;
      for (let i = 0; i < s2pd.draggableObjects.length; i++) {
        s2pd.draggableObjects[i].dragging = false;
      }
    }
    if (s2pd.holdStarted) {
      for (let i = 0; i < s2pd.holdableObjects.length; i++) {
        if (s2pd.holdableObjects[i].holdDown) {
          s2pd.holdableObjects[i].finishedHolding = true;
          s2pd.holdableObjects[i].holdDown = false;
          onBeingLetUp(s2pd.holdableObjects[i]);
        }
      }
      s2pd.holdStarted = false;
    }
  },

  mouseClick: function (event) {
    s2pd.firstClick();
    let clickedObject;
    let canvasPos = s2pd.canvas.getBoundingClientRect();
    s2pd.mouseX = Math.floor(event.clientX - canvasPos.left);
    s2pd.mouseY = Math.floor(event.clientY - canvasPos.top);
    for (let i = 0; i < s2pd.clickableObjects.length; i++) {
      if (
        s2pd.mouseX >= s2pd.clickableObjects[i].hitBoxX &&
        s2pd.mouseY >= s2pd.clickableObjects[i].hitBoxY &&
        s2pd.mouseX <= s2pd.clickableObjects[i].hitBoxX + s2pd.clickableObjects[i].hitBoxWidth &&
        s2pd.mouseY <= s2pd.clickableObjects[i].hitBoxY + s2pd.clickableObjects[i].hitBoxHeight
      ) {
        clickedObject = s2pd.clickableObjects[i];
        clickedObject.clicked = true;
      }
    }
  },

  keyboardHelper: {
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    space: 32,
    enter: 13,
    esc: 27
  },
  rightDown: false,
  leftDown: false,
  upDown: false,
  downDown: false,
  spaceDown: false,
  escDown: false,
  enterDown: false,
  spaceUp: false,
  leftUp: false,
  rightUp: false,
  upUp: false,
  downUp: false,
  escUp: false,
  enterUp: false,
  /// Detect keys touched.
  keyDownHandler: function (event) {
    if (event.keyCode === s2pd.keyboardHelper.right) {
      s2pd.rightDown = true;
    }
    if (event.keyCode === s2pd.keyboardHelper.left) {
      s2pd.leftDown = true;
    }
    if (event.keyCode === s2pd.keyboardHelper.down) {
      s2pd.downDown = true;
    }
    if (event.keyCode === s2pd.keyboardHelper.up) {
      s2pd.upDown = true;
    }
    if (event.keyCode === s2pd.keyboardHelper.space) {
      s2pd.spaceDown = true;
    }
    if (event.keyCode === s2pd.keyboardHelper.esc) {
      s2pd.escDown = true;
    } else if (event.keyCode === s2pd.keyboardHelper.enter) {
      s2pd.enterDown = true;
    }
  },
  keyUpHandler: function (event) {
    if (event.keyCode === s2pd.keyboardHelper.right) {
      s2pd.rightDown = false;
      s2pd.rightUp = true;
    }
    if (event.keyCode === s2pd.keyboardHelper.left) {
      s2pd.leftDown = false;
      s2pd.leftUp = true;
    }
    if (event.keyCode === s2pd.keyboardHelper.down) {
      s2pd.downDown = false;
      s2pd.downUp = true;
    }
    if (event.keyCode === s2pd.keyboardHelper.up) {
      s2pd.upDown = false;
      s2pd.upUp = true;
    }
    if (event.keyCode === s2pd.keyboardHelper.space) {
      s2pd.spaceDown = false;
      s2pd.spaceUp = true;
    }
    if (event.keyCode === s2pd.keyboardHelper.esc) {
      s2pd.escDown = false;
      s2pd.escUp = true;
    } else if (event.keyCode === s2pd.keyboardHelper.enter) {
      s2pd.enterDown = false;
      s2pd.enterUp = true;
    }
  }
};

/////////////************MOUSE EVENT LISTENERS***************//////
document.addEventListener('click', function (event) {
  s2pd.mouseClick(event);
});
document.addEventListener('mousemove', function (event) {
  s2pd.mouseMove(event);
});
document.addEventListener('mousedown', function (event) {
  s2pd.mouseDown(event);
});
document.addEventListener('mouseup', function () {
  s2pd.mouseUp();
});
document.addEventListener('pointerdown', function (event) {
  s2pd.mouseDown(event);
}); // chrome doesn't use mousedown. must you pointerdown

//////////************************TOUCH EVENT LISTENERS*****************************************

document.addEventListener(
  'touchstart',
  function (e) {
    // Cache the client X/Y coordinates
    let canvasPos = s2pd.canvas.getBoundingClientRect();
    s2pd.touchX = Math.floor(e.touches[0].clientX - canvasPos.left);
    s2pd.touchY = Math.floor(e.touches[0].clientY - canvasPos.top);
    if (s2pd.enableDragAndDrop === true) {
      let clickedObject;
      let draggableOrNot = false;
      s2pd.dragStarted = true;
      for (let i = 0; i < s2pd.draggableObjects.length; i++) {
        if (
          s2pd.touchX >= s2pd.draggableObjects[i].hitBoxX &&
          s2pd.touchY >= s2pd.draggableObjects[i].hitBoxY &&
          s2pd.touchX <= s2pd.draggableObjects[i].hitBoxX + s2pd.draggableObjects[i].hitBoxWidth &&
          s2pd.touchY <= s2pd.draggableObjects[i].hitBoxY + s2pd.draggableObjects[i].hitBoxHeight
        ) {
          s2pd.draggingWithMouse = false;
          draggableOrNot = true;
          if (draggableOrNot) {
            clickedObject = s2pd.draggableObjects[i];
            clickedObject.dragging = true;
          }
        }
      }
    }
  },
  false
);

document.addEventListener('touchmove', function (e) {
  let canvasPos = s2pd.canvas.getBoundingClientRect();
  s2pd.touchMoveX = Math.floor(e.touches[0].clientX - canvasPos.left);
  s2pd.touchMoveY = Math.floor(e.touches[0].clientY - canvasPos.top);
});

document.addEventListener('touchend', function (e) {
  let canvasPos = s2pd.canvas.getBoundingClientRect();
  s2pd.touchEndX = Math.floor(e.changedTouches[0].clientX - canvasPos.left);
  s2pd.touchEndY = Math.floor(e.changedTouches[0].clientY - canvasPos.top);

  for (let i = 0; i < s2pd.draggableObjects.length; i++) {
    s2pd.draggableObjects[i].dragging = false;
    s2pd.dragStarted = false;
  }
  if (s2pd.holdStarted) {
    for (let i = 0; i < s2pd.holdableObjects.length; i++) {
      if (s2pd.holdableObjects[i].holdDown) {
        s2pd.holdableObjects[i].finishedHolding = true;
        s2pd.holdableObjects[i].holdDown = false;
        onBeingLetUp(s2pd.holdableObjects[i]);
      }
    }
    s2pd.holdStarted = false;
  }
});

//////////*****************KEYBOARD STUFF*************************************

document.addEventListener('keydown', s2pd.keyDownHandler, false);
document.addEventListener('keyup', s2pd.keyUpHandler, false);

//CANVAS
// ***************************SCREEN****************************************

const canvas = document.createElement('canvas');
canvas.id = 'canvas';
canvas.style.touchAction = 'none';
const ctx = canvas.getContext('2d');
s2pd.canvas = canvas;
s2pd.ctx = ctx;
document.body.appendChild(s2pd.canvas);

s2pd.width = s2pd.canvas.width;
s2pd.height = s2pd.canvas.height;
