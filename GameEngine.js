/**
 * Game Engine | Copyright Dan Walker 2016
 */
var GameEngine = function(){

    var gEngine = this;
    gEngine.positionOffset = {x:0,y:0};
    gEngine.backgroundImage = {};
    gEngine.resCharacter = null;
    gEngine.resRedrawFunction = null;
    gEngine.map = {};
    gEngine.sprites = {};
    gEngine.objAudio = null;
    gEngine.objText = null;
    gEngine.objDialog = null;
    gEngine.keysDown = {};
    gEngine.lastFrame = Date.now();
    gEngine.intModifier = 0.016;
    gEngine.fps = 0;
    gEngine.fpsInterval = 0;

    gEngine.defaultFont = "Helvetica";
    gEngine.defaultSize = 16;
    gEngine.defaultColor = "#888888";

    gEngine.startTime = 0;
    gEngine.lastFrameTime = 0;
    gEngine.elapsedTime = 0;

    //Cross-browser support for requestAnimationFrame
    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

    gEngine.keyboard = function(){
        addEventListener("keydown", function(e){ gEngine.keysDown[e.keyCode] = true; }, false);
        addEventListener("keyup", function(e){ delete gEngine.keysDown[e.keyCode]; }, false);
    }

    gEngine.create = function(width,height,frameRate){

        // Create the canvas
        gEngine.resCanvas = document.createElement("canvas");
        gEngine.resContext = gEngine.resCanvas.getContext("2d");

        gEngine.resCanvas.width = gEngine.map.width = width;
        gEngine.resCanvas.height = gEngine.map.height = height;

        //Set the framerate of the game, default is 24/fps
        gEngine.fps = (frameRate == undefined) ? 24 : frameRate;
        gEngine.fpsInterval = 1000 / gEngine.fps;

        gEngine.lastFrameTime = Date.now();

        document.body.appendChild(gEngine.resCanvas);
    }

    gEngine.clear = function(){
        gEngine.resContext.clearRect(0, 0, gEngine.resCanvas.width, gEngine.resCanvas.height);
    }

    gEngine.run = function(){

        // Request to do this again ASAP
        requestAnimationFrame(gEngine.run.bind(gEngine));

        var currentFrameTime = Date.now();
        gEngine.elapsedTime = currentFrameTime - gEngine.lastFrameTime;

        if(gEngine.elapsedTime > gEngine.fpsInterval){

            // Get ready for next frame by setting lastFrameTime=currentFrameTime, but also adjust for your
            // specified fpsInterval not being a multiple of requestAnimationFrame's interval (16.7ms)
            gEngine.lastFrameTime = currentFrameTime - (gEngine.elapsedTime % gEngine.fpsInterval);

            //Clear the window before redraw
            gEngine.clear();

            //Update characters position
            if(gEngine.resCharacter != null){
                gEngine.moveCharacter();
            }else{
                //Draw the background for the frame
                gEngine.backgroundImage.drawFull(0,0);
            }

            //Redraw the frame if required
            if(gEngine.resRedrawFunction != null){
                gEngine.resRedrawFunction();
            }
        }
    }

    gEngine.map = function(width,height){
        gEngine.map.width = width;
        gEngine.map.height = height;
    }

    gEngine.setBackground = function(strBackground){
        gEngine.backgroundImage = new gEngine.sprite({ imagePath:strBackground, x:0, y:0, width:gEngine.resCanvas.width, height:gEngine.resCanvas.height });
    }

    gEngine.setBackgroundLayered = function(strBackground,ground,layer1){
        gEngine.backgroundImage = new gEngine.backgroundLayers(strBackground,ground,layer1);
    }

    gEngine.setBackgroundRepeat = function(strBackground){
        gEngine.backgroundImage = new gEngine.backgroundPattern(strBackground);
    }

    gEngine.createCharacter = function(intSpeed,strAvatar,blCenterLock){
        gEngine.resCharacter = {};
        gEngine.resCharacter.centerLock = blCenterLock;
        gEngine.resCharacter.speed = intSpeed;
        gEngine.resCharacter.speed_multiplier = 1;
        gEngine.resCharacter.avatar = new gEngine.sprite({ imagePath:strAvatar, x:0, y:0, width:32, height:32 });
        gEngine.resCharacter.x = myGame.resCanvas.width / 2;
        gEngine.resCharacter.y = myGame.resCanvas.height / 2;
        gEngine.resCharacter.mapX = myGame.resCanvas.height / 2;
        gEngine.resCharacter.mapY = myGame.resCanvas.height / 2;
    }

    gEngine.moveCharacter = function(){

        var resMoveItem = null;
        var arrKeyOrder = {};

        //Flip the directions if the character is fixed in the center of the screen
        if(gEngine.resCharacter.centerLock){
            resMoveItem = gEngine.backgroundImage;
            arrKeyOrder = {0:40,1:38,2:39,3:37};
        }else{
            resMoveItem = gEngine.resCharacter;
            arrKeyOrder = {0:38,1:40,2:37,3:39};
        }

        var x = resMoveItem.x;
        var y = resMoveItem.y;

        if(16 in gEngine.keysDown){ // Player holding shift
            gEngine.resCharacter.speed_multiplier = 2;
        }else{
            gEngine.resCharacter.speed_multiplier = 1;
        }

        var intCurrentSpeed = (gEngine.resCharacter.speed * gEngine.resCharacter.speed_multiplier);

        //Calculate the new positions of the character or everything else
        if(arrKeyOrder[0] in gEngine.keysDown){ // Player holding up
            y -= intCurrentSpeed;
        }

        if(arrKeyOrder[1] in gEngine.keysDown){ // Player holding down
            y += intCurrentSpeed;
        }

        if(arrKeyOrder[2] in gEngine.keysDown){ // Player holding left
            x -= intCurrentSpeed;
        }

        if(arrKeyOrder[3] in gEngine.keysDown){ // Player holding right
            x += intCurrentSpeed;
        }

        if(gEngine.checkBoundary(x,y)){

            resMoveItem.x = x;
            resMoveItem.y = y;

            //Now update either the character or the background
            if(gEngine.resCharacter.centerLock){
                gEngine.positionOffset.y = resMoveItem.y;
                gEngine.positionOffset.x = resMoveItem.x;
                resMoveItem.drawFull(0,0);
                gEngine.resCharacter.avatar.drawFull(
                    gEngine.resCharacter.x - gEngine.positionOffset.x,
                    gEngine.resCharacter.y - gEngine.positionOffset.y
                )
                gEngine.resCharacter.mapX = (gEngine.resCharacter.x - gEngine.positionOffset.x)
                gEngine.resCharacter.mapY = (gEngine.resCharacter.y - gEngine.positionOffset.y)
            }else{
                gEngine.backgroundImage.drawFull(0,0);
                resMoveItem.avatar.drawFull(resMoveItem.x,resMoveItem.y)
                gEngine.resCharacter.mapX = resMoveItem.x
                gEngine.resCharacter.mapY = resMoveItem.y
            }
        }else{
            (gEngine.resCharacter.centerLock) ? resMoveItem.drawFull(0,0) : gEngine.backgroundImage.drawFull(0,0);
        }
    }

    gEngine.repositionCharacter = function(x,y){
        gEngine.resCharacter.x = x;
        gEngine.resCharacter.y = y;
    }

    gEngine.followCharacter = function(x,y,speed){
        return gEngine.follow(x,y,gEngine.resCharacter.mapX,gEngine.resCharacter.mapY,speed);
    }

    gEngine.updateFrame = function(resRedrawFunction){
        gEngine.resRedrawFunction = resRedrawFunction;
    }

    gEngine.follow = function(x,y,targetX,targetY,speed){

        //Correct the followers position when close to prevent jittering
        if(targetX <= x + speed && targetX >= x - speed){
            x = targetX;
        }

        if(targetY <= y + speed && targetY >= y - speed){
            y = targetY;
        }

        //Aim the follower in the direction of the target
        if(targetX > x){
            x += speed;
        }else if(targetX < x){
            x -= speed;
        }

        if(targetY > y){
            y += speed;
        }else if(targetY < y){
            y -= speed;
        }

        return {x: x, y: y};
    }

    gEngine.checkProximity = function(posX,posY,locationX,locationY,proximityRange){
        return (gEngine.difference(posX,locationX) < proximityRange && gEngine.difference(posY,locationY) < proximityRange);
    }

    gEngine.difference = function(a, b){
        return Math.abs(a - b);
    }

    gEngine.checkBoundary = function(x,y){
        //Check to see if the user can go any further
        var blAllowMovement = true;

        var arrPositions = {
            charX: gEngine.resCharacter.mapX,
            charY: gEngine.resCharacter.mapY,
            avatarWidth: gEngine.resCharacter.avatar.width,
            avatarHeight: gEngine.resCharacter.avatar.height,
            mapWidth: gEngine.map.width,
            mapHeight: gEngine.map.height,
            offsetX: gEngine.positionOffset.x,
            offsetY: gEngine.positionOffset.y
        };

        if(gEngine.resCharacter.centerLock){

            //Fix to allow center locked chars to get to the edge
            x = x - (myGame.resCanvas.width / 2);
            y = y - (myGame.resCanvas.height / 2)

            if(x > arrPositions.charX || y > arrPositions.charY){
                blAllowMovement = false;
            }else if((x-(arrPositions.charX+arrPositions.avatarWidth)) + arrPositions.mapWidth < 0 || (y-(arrPositions.charY+arrPositions.avatarHeight)) + arrPositions.mapHeight < 0){
                blAllowMovement = false;
            }
        }else{

            if(x < 0  || y < 0){
                blAllowMovement = false;
            }else if(x > (gEngine.map.width - gEngine.resCharacter.avatar.width)  || y > (gEngine.map.height - gEngine.resCharacter.avatar.height)){
                blAllowMovement = false;
            }
        }

        return blAllowMovement;
    }

    gEngine.audio = function(){

        if(gEngine.objAudio == null){
            gEngine.objAudio = new gEngine.audioHandler();
        }

        return gEngine.objAudio;
    }

    gEngine.audioHandler = function(){

        var gAudio = this;
        var gAudioFiles = {};

        gAudio.load = function(mxdReference, audioPath, fltVolume){

            fltVolume = (fltVolume == undefined || fltVolume == null) ? .60 : fltVolume;

            var resAudioFile = new Audio(audioPath);
            resAudioFile.volume = fltVolume;
            resAudioFile.load();

            gAudioFiles[mxdReference] = resAudioFile;
        }

        gAudio.play = function(mxdReference,blForceReplay){

            //If the audiofile is currently playing this reset so it can be replayed instantly
            if(blForceReplay && !gAudioFiles[mxdReference].paused){
                gAudioFiles[mxdReference].pause();
                gAudioFiles[mxdReference].currentTime = 0;
            }

            gAudioFiles[mxdReference].play();
        }

        gAudio.stop = function(mxdReference){
            gAudioFiles[mxdReference].stop();
        }

        gAudio.loop = function(mxdReference){
            gAudioFiles[mxdReference].loop = true;
            gAudioFiles[mxdReference].play();
        }

        gAudio.pauseAll = function(){

            //Pause all audio files that are currently playing
            for(var mxdReference in gAudioFiles){
                if(gAudioFiles.hasOwnProperty(mxdReference) && gAudioFiles[mxdReference].duration > 0 && !gAudioFiles[mxdReference].paused){
                    gAudioFiles[mxdReference].pause();
                }
            }
        }

        gAudio.resumeAll = function(){

            //Resume all audio files that have been paused
            for(var mxdReference in gAudioFiles){
                if(gAudioFiles.hasOwnProperty(mxdReference) && gAudioFiles[mxdReference].duration > 0 && gAudioFiles[mxdReference].paused){
                    gAudioFiles[mxdReference].play();
                }
            }
        }
    }

    gEngine.createSprite = function(mxdReference,options){
        gEngine.sprites[mxdReference] = new gEngine.sprite(options);
    }

    gEngine.sprite = function(options){

        var gSprite = this;

        gSprite.load = function(imagePath){
            var resImage = this;
            resImage.image = new Image();
            resImage.image.src = imagePath;
            resImage.image.onload = function(){
                resImage.isLoaded = true;
            }
        }

        gSprite.drawFull = function(x,y){

            x = gEngine.positionOffset.x + x;
            y = gEngine.positionOffset.y + y;

            gEngine.resContext.drawImage(gSprite.image,x,y);
        }

        gSprite.draw = function(x,y){

            x = gEngine.positionOffset.x + x;
            y = gEngine.positionOffset.y + y;

            gEngine.resContext.drawImage(gSprite.image, gSprite.x, gSprite.y, gSprite.width, gSprite.height, x, y, gSprite.width, gSprite.height);
        }

        gSprite.drawSolid = function(x,y){

            x = gEngine.positionOffset.x + x;
            y = gEngine.positionOffset.y + y;

            gEngine.resContext.drawImage(gSprite.image, gSprite.x, gSprite.y, gSprite.width, gSprite.height, x, y, gSprite.width, gSprite.height);
        }

        gSprite.load(options.imagePath);
        gSprite.x = options.x;
        gSprite.y = options.y;
        gSprite.width = options.width;
        gSprite.height = options.height;
        gSprite.isLoaded = false;
    }

    gEngine.healthBar = function(health,totalHealth,width){

        width = (width == undefined) ? 120 : width;
        intPixelsPerPercent = ((width-2) / 100);
        intLifePercentage = 100/totalHealth * health;

        if(intLifePercentage > 100){
            intLifePercentage = 100;
        }else if(intLifePercentage < 0){
            intLifePercentage = 0;
        }

        intMeterFill = intLifePercentage * intPixelsPerPercent;

        //Outline lifemeter
        gEngine.resContext.beginPath();
        gEngine.resContext.lineWidth="1";
        gEngine.resContext.strokeStyle="#FFF";
        gEngine.resContext.rect(10,10,width,20);
        gEngine.resContext.stroke();

        //Fill remaining life
        gEngine.resContext.beginPath();
        gEngine.resContext.fillStyle="rgba(255, 0, 0, 0.5)";
        gEngine.resContext.fillRect(11,11,width-2,18);

        //Fill remaining life
        gEngine.resContext.beginPath();
        gEngine.resContext.fillStyle="green";
        gEngine.resContext.fillRect(11,11,intMeterFill,18);

        return intLifePercentage;
    }

    gEngine.dialog = function(){

        if(gEngine.objDialog == null){
            gEngine.objDialog = new gEngine.dialogHandler();
        }

        return gEngine.objDialog;
    }

    gEngine.dialogHandler = function(){

        var gDialog = this;

        gDialog.draw = function(x,y,width,height,title,message,fontSize){

            //Outline Dialog
            gEngine.resContext.beginPath();
            gEngine.resContext.lineWidth="1";
            gEngine.resContext.strokeStyle="#FFF";
            gEngine.resContext.shadowBlur=20;
            gEngine.resContext.shadowColor="black";
            gEngine.resContext.rect(x,y,width,height);
            gEngine.resContext.stroke();

            //Fill Dialog
            gEngine.resContext.beginPath();
            gEngine.resContext.shadowBlur=0;
            gEngine.resContext.fillStyle="#CAE1FF";
            gEngine.resContext.fillRect(x+1,y+1,width-2,height-2);

            var messageY = 0;

            if(title != undefined && title != null){
                //Output the title and push the message down
                gEngine.text().drawCentered(x + 1, y + (fontSize + 10), width - 2, title, fontSize);
                messageY = (fontSize + 10) + 6;
            }

            if(message != undefined && message != null){
                //Put a 20px margin on the wrapped text
                gEngine.text().drawWrapped(x + 20, y + messageY, width - 40, message);
            }
        }

        gDialog.paused = function(x,y,width,height){
            gDialog.draw(x, y, width, height, "Game Paused", null, 24);
        }

        gDialog.gameover = function(x,y,width,height){
            gDialog.draw(x, y, width, height, "Game Over!", null, 24);
        }

        gDialog.about = function(x,y,width,height){

            var message = "Game-Engine is a lightweight JS framework to create HTML5 Canvas games, it has been designed to allow a developer to easily create map based, side scrolling and arcade style games.\n\nFind us on GitHub\nhttps://github.com/danrwalker/game-engine\nCopyright 2016 Dan Walker";
            gDialog.draw(x, y, width, height, "About Game-Engine", message, 24);
        }
    }

    gEngine.text = function(){

        if(gEngine.objText == null){
            gEngine.objText = new gEngine.textHandler();
        }

        return gEngine.objText;
    }

    gEngine.textHandler = function(){

        var gText = this;

        gText.set = function(size,color,font){

            size = (size == undefined || size == null) ? gEngine.defaultSize : size;
            color = (color == undefined || color == null) ? gEngine.defaultColor : color;
            font = (font == undefined || font == null) ? gEngine.defaultFont : font;

            gEngine.resContext.font=size+"px "+font;
            gEngine.resContext.fillStyle=color;
        }

        gText.draw = function(x,y,text,size,color,font){

            gText.set(size,color,font);
            gEngine.resContext.fillText(text,x,y);
        }

        gText.drawCentered = function(x,y,width,text,size,color,font){

            gText.set(size,color,font);
            x = ((width - gEngine.resContext.measureText(text).width) / 2) + x;
            gEngine.resContext.fillText(text,x,y);
        }

        gText.drawWrapped = function(x,y,maxWidth,text,lineHeight,size,color,font){

            gText.set(size,color,font);

            var intStartY = y;
            var strParsedText = text.replace(/\n/g, ' |br| ');
            var arrWords = strParsedText.split(' ');
            var strLine = '';

            for(var n = 0; n < arrWords.length; n++) {

                blNewLine = (arrWords[n].indexOf("|br|") > -1);

                var strTestLine = strLine + arrWords[n] + " ";
                var metrics = maxWidth;
                var testWidth = maxWidth;

                if(gEngine.resContext.measureText){
                    metrics = gEngine.resContext.measureText(strTestLine);
                    testWidth = metrics.width;
                }

                if((testWidth > maxWidth && n > 0) || blNewLine){
                    gEngine.resContext.fillText(strLine,x,y);
                    strLine = (blNewLine) ? "" : arrWords[n] + " ";
                    y += lineHeight;
                }else{
                    strLine = strTestLine;
                }
            }

            if(strLine != "" && strLine != " "){
                gEngine.resContext.fillText(strLine,x,y);
                y += lineHeight;
            }

            //Return the height of the overall height of the text added
            return {startY: intStartY, finishY: y, height: y - intStartY};
        }
    }

    gEngine.backgroundPattern = function(imagePath){

        var gBackground = this;

        gBackground.load = function(imagePath){
            var resImage = this;
            resImage.image = new Image();
            resImage.image.src = imagePath;
            resImage.image.onload = function(){
                resImage.isLoaded = true;
            }
        }

        gBackground.drawFull = function(x,y){

            x = gEngine.positionOffset.x + x;
            y = gEngine.positionOffset.y + y;

            // create pattern
            var ptrn = gEngine.resContext.createPattern(gBackground.image, 'repeat'); // Create a pattern with this image, and set it to "repeat".
            gEngine.resContext.fillStyle = ptrn;
            gEngine.resContext.translate(x, y);
            gEngine.resContext.fillRect(-x,-y,gEngine.map.width, gEngine.map.height); // context.fillRect(x, y, width, height);
            gEngine.resContext.translate(-x, -y);
        }

        gBackground.load(imagePath);
        gBackground.x = 0;
        gBackground.y = 0;
        gBackground.isLoaded = false;
    }

    gEngine.backgroundLayers = function(imagePath,ground,layer1){

        var gBackground = this;

        gBackground.ground = ground;
        gBackground.layer1 = layer1;

        gBackground.load = function(imagePath){
            var resImage = this;
            resImage.image = new Image();
            resImage.image.src = imagePath;
            resImage.image.onload = function(){
                resImage.isLoaded = true;
            }
        }

        gBackground.drawFull = function(x,y){

            x = Math.round(gEngine.positionOffset.x + x);
            y = Math.round(gEngine.positionOffset.y + y);

            var tileSize = 32;       // The size of a tile (32×32)
            var rowTileCount = 20;   // The number of tiles in a row of our background
            var colTileCount = 32;   // The number of tiles in a column of our background
            var imageNumTiles = 16;  // The number of tiles per row in the tileset image

            for (var r = 0; r < rowTileCount; r++) {
                for (var c = 0; c < colTileCount; c++) {
                    var tile = gBackground.ground[ r ][ c ];

                    var tileRow = (tile / imageNumTiles) | 0; // Bitwise OR operation
                    var tileCol = (tile % imageNumTiles) | 0;

                    gEngine.resContext.drawImage(gBackground.image,(tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize,(c * tileSize)+x, (r * tileSize)+y,tileSize,tileSize);
                }
            }

            for (var r = 0; r < rowTileCount; r++) {
                for (var c = 0; c < colTileCount; c++) {
                    var tile = gBackground.layer1[ r ][ c ];

                    var tileRow = (tile / imageNumTiles) | 0; // Bitwise OR operation
                    var tileCol = (tile % imageNumTiles) | 0;

                    gEngine.resContext.drawImage(gBackground.image,(tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize,(c * tileSize)+x, (r * tileSize)+y,tileSize,tileSize);
                }
            }
        }

        gBackground.load(imagePath);
        gBackground.x = 0;
        gBackground.y = 0;
        gBackground.isLoaded = false;
    }
}