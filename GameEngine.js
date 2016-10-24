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
    gEngine.keysDown = {};
    gEngine.lastFrame = Date.now();
    gEngine.intModifier = 0.016;
    gEngine.fps = 0;
    gEngine.fpsInterval = 0;

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

        gEngine.resContext.fillRect(25,25,100,100);
        gEngine.resContext.clearRect(45,45,60,60);
        gEngine.resContext.strokeRect(50,50,50,50);
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

    gEngine.createSprite = function(mxdReference,options){
        gEngine.sprites[mxdReference] = new gEngine.sprite(options);
    }

    gEngine.sprite = function(options){

        var shdwSprite = this;

        shdwSprite.load = function(imagePath){
            var resImage = this;
            resImage.image = new Image();
            resImage.image.src = imagePath;
            resImage.image.onload = function(){
                resImage.isLoaded = true;
            }
        }

        shdwSprite.drawFull = function(x,y){

            x = gEngine.positionOffset.x + x;
            y = gEngine.positionOffset.y + y;

            gEngine.resContext.drawImage(shdwSprite.image,x,y);
        }

        shdwSprite.draw = function(x,y){

            x = gEngine.positionOffset.x + x;
            y = gEngine.positionOffset.y + y;

            gEngine.resContext.drawImage(shdwSprite.image, shdwSprite.x, shdwSprite.y, shdwSprite.width, shdwSprite.height, x, y, shdwSprite.width, shdwSprite.height);
        }

        shdwSprite.drawSolid = function(x,y){

            x = gEngine.positionOffset.x + x;
            y = gEngine.positionOffset.y + y;

            gEngine.resContext.drawImage(shdwSprite.image, shdwSprite.x, shdwSprite.y, shdwSprite.width, shdwSprite.height, x, y, shdwSprite.width, shdwSprite.height);
        }

        shdwSprite.load(options.imagePath);
        shdwSprite.x = options.x;
        shdwSprite.y = options.y;
        shdwSprite.width = options.width;
        shdwSprite.height = options.height;
        shdwSprite.isLoaded = false;
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