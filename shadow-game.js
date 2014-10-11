/**
 * Shadow Game 0.9.0 | Dan Walker - 08/06/2014
 */
var shadowGame = function(){

    var shdwGame = this;
    shdwGame.positionOffset = {x:0,y:0};
    shdwGame.backgroundImage = {};
    shdwGame.resCharacter = null;
    shdwGame.resRedrawFunction = null;
    shdwGame.map = {};
    shdwGame.sprites = {};
    shdwGame.keysDown = {};
    shdwGame.lastFrame = Date.now();

    //Cross-browser support for requestAnimationFrame
    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

    shdwGame.keyboard = function(){
        addEventListener("keydown", function(e){ shdwGame.keysDown[e.keyCode] = true; }, false);
        addEventListener("keyup", function(e){ delete shdwGame.keysDown[e.keyCode]; }, false);
    }

    shdwGame.create = function(width,height){

        // Create the canvas
        shdwGame.resCanvas = document.createElement("canvas");
        shdwGame.resContext = shdwGame.resCanvas.getContext("2d");

        shdwGame.resCanvas.width = shdwGame.map.width = width;
        shdwGame.resCanvas.height = shdwGame.map.height = height;

        document.body.appendChild(shdwGame.resCanvas);
    }

    shdwGame.clear = function(){
        shdwGame.resContext.clearRect(0, 0, shdwGame.resCanvas.width, shdwGame.resCanvas.height);

        shdwGame.resContext.fillRect(25,25,100,100);
        shdwGame.resContext.clearRect(45,45,60,60);
        shdwGame.resContext.strokeRect(50,50,50,50);
    }

    shdwGame.run = function(){

        var currentFrame = Date.now();
        var delta = currentFrame - shdwGame.lastFrame;
        var intModifier = delta / 1000;

        //Clear the window before redraw
        shdwGame.clear();

        //Update characters position
        if(shdwGame.resCharacter != null){
            shdwGame.moveCharacter(intModifier);
        }else{
            //Draw the background for the frame
            shdwGame.backgroundImage.drawFull(0,0);
        }

        //Redraw the frame if required
        if(shdwGame.resRedrawFunction != null){
            shdwGame.resRedrawFunction();
        }

        shdwGame.lastFrame = currentFrame;

        // Request to do this again ASAP
        requestAnimationFrame(shdwGame.run.bind(shdwGame));

    }

    shdwGame.map = function(width,height){
        shdwGame.map.width = width;
        shdwGame.map.height = height;
    }

    shdwGame.setBackground = function(strBackground){
        shdwGame.backgroundImage = new shdwGame.sprite({ imagePath:strBackground, x:0, y:0, width:shdwGame.resCanvas.width, height:shdwGame.resCanvas.height });
    }

    shdwGame.setBackgroundLayered = function(strBackground,ground,layer1){
        shdwGame.backgroundImage = new shdwGame.backgroundLayers(strBackground,ground,layer1);
    }

    shdwGame.setBackgroundRepeat = function(strBackground){
        shdwGame.backgroundImage = new shdwGame.backgroundPattern(strBackground);
    }

    shdwGame.createCharacter = function(intSpeed,strAvatar,blCenterLock){
        shdwGame.resCharacter = {};
        shdwGame.resCharacter.centerLock = blCenterLock;
        shdwGame.resCharacter.speed = intSpeed;
        shdwGame.resCharacter.speed_multiplier = 1;
        shdwGame.resCharacter.avatar = new shdwGame.sprite({ imagePath:strAvatar, x:0, y:0, width:32, height:32 });
        shdwGame.resCharacter.x = myGame.resCanvas.width / 2;
        shdwGame.resCharacter.y = myGame.resCanvas.height / 2;
    }

    shdwGame.moveCharacter = function(intModifier){

        var resMoveItem = null;
        var arrKeyOrder = {};

        //Flip the directions if the character is fixed in the center of the screen
        if(shdwGame.resCharacter.centerLock){
            resMoveItem = shdwGame.backgroundImage;
            arrKeyOrder = {0:40,1:38,2:39,3:37};
        }else{
            resMoveItem = shdwGame.resCharacter;
            arrKeyOrder = {0:38,1:40,2:37,3:39};
        }

        var x = resMoveItem.x;
        var y = resMoveItem.y;

        if(16 in shdwGame.keysDown){ // Player holding up
            shdwGame.resCharacter.speed_multiplier = 2;
        }else{
            shdwGame.resCharacter.speed_multiplier = 1;
        }

        var intCurrentSpeed = (shdwGame.resCharacter.speed * shdwGame.resCharacter.speed_multiplier);

        //Calculate the new positions of the character or everything else
        if(arrKeyOrder[0] in shdwGame.keysDown){ // Player holding up
            y -= intCurrentSpeed * intModifier;
        }

        if(arrKeyOrder[1] in shdwGame.keysDown){ // Player holding down
            y += intCurrentSpeed * intModifier;
        }

        if(arrKeyOrder[2] in shdwGame.keysDown){ // Player holding left
            x -= intCurrentSpeed * intModifier;
        }

        if(arrKeyOrder[3] in shdwGame.keysDown){ // Player holding right
            x += intCurrentSpeed * intModifier;
        }

        if(shdwGame.checkBoundary(x,y)){

            resMoveItem.x = x;
            resMoveItem.y = y;

            //Now update either the character or the background
            if(shdwGame.resCharacter.centerLock){
                shdwGame.positionOffset.y = resMoveItem.y;
                shdwGame.positionOffset.x = resMoveItem.x;
                resMoveItem.drawFull(0,0);
                shdwGame.resCharacter.avatar.drawFull(
                    shdwGame.resCharacter.x - shdwGame.positionOffset.x,
                    shdwGame.resCharacter.y - shdwGame.positionOffset.y
                )
            }else{
                shdwGame.backgroundImage.drawFull(0,0);
                resMoveItem.avatar.drawFull(resMoveItem.x,resMoveItem.y)
            }
        }else{
            (shdwGame.resCharacter.centerLock) ? resMoveItem.drawFull(0,0) : shdwGame.backgroundImage.drawFull(0,0);
        }
    }

    shdwGame.repositionCharacter = function(x,y){
        shdwGame.resCharacter.x = x;
        shdwGame.resCharacter.y = y;
    }

    shdwGame.updateFrame = function(resRedrawFunction){
        shdwGame.resRedrawFunction = resRedrawFunction;
    }

    shdwGame.checkBoundary = function(x,y){
        //Check to see if the user can go any further
        var blAllowMovement = true;

        var arrPositions = {
            charX: shdwGame.resCharacter.x,
            charY: shdwGame.resCharacter.y,
            avatarWidth: shdwGame.resCharacter.avatar.width,
            avatarHeight: shdwGame.resCharacter.avatar.height,
            mapWidth: shdwGame.map.width,
            mapHeight: shdwGame.map.height,
            offsetX: shdwGame.positionOffset.x,
            offsetY: shdwGame.positionOffset.y
        };

        if(shdwGame.resCharacter.centerLock){
            if(x > arrPositions.charX || y > arrPositions.charY){
                blAllowMovement = false;
            }else if((x-(arrPositions.charX+arrPositions.avatarWidth)) + arrPositions.mapWidth < 0 || (y-(arrPositions.charY+arrPositions.avatarHeight)) + arrPositions.mapHeight < 0){
                blAllowMovement = false;
            }
        }else{
            if(x < 0  || y < 0){
                blAllowMovement = false;
            }else if(x > (shdwGame.map.width - shdwGame.resCharacter.avatar.width)  || y > (shdwGame.map.height - shdwGame.resCharacter.avatar.height)){
                blAllowMovement = false;
            }
        }

        return blAllowMovement;
    }

    shdwGame.createSprite = function(mxdReference,options){
        shdwGame.sprites[mxdReference] = new shdwGame.sprite(options);
    }

    shdwGame.sprite = function(options){

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

            x = shdwGame.positionOffset.x + x;
            y = shdwGame.positionOffset.y + y;

            shdwGame.resContext.drawImage(shdwSprite.image,x,y);
        }

        shdwSprite.draw = function(x,y){

            x = shdwGame.positionOffset.x + x;
            y = shdwGame.positionOffset.y + y;

            shdwGame.resContext.drawImage(shdwSprite.image, shdwSprite.x, shdwSprite.y, shdwSprite.width, shdwSprite.height, x, y, shdwSprite.width, shdwSprite.height);
        }

        shdwSprite.drawSolid = function(x,y){

            x = shdwGame.positionOffset.x + x;
            y = shdwGame.positionOffset.y + y;

            shdwGame.resContext.drawImage(shdwSprite.image, shdwSprite.x, shdwSprite.y, shdwSprite.width, shdwSprite.height, x, y, shdwSprite.width, shdwSprite.height);
        }

        shdwSprite.load(options.imagePath);
        shdwSprite.x = options.x;
        shdwSprite.y = options.y;
        shdwSprite.width = options.width;
        shdwSprite.height = options.height;
        shdwSprite.isLoaded = false;
    }

    shdwGame.backgroundPattern = function(imagePath){

        var shdwBG = this;

        shdwBG.load = function(imagePath){
            var resImage = this;
            resImage.image = new Image();
            resImage.image.src = imagePath;
            resImage.image.onload = function(){
                resImage.isLoaded = true;
            }
        }

        shdwBG.drawFull = function(x,y){

            x = shdwGame.positionOffset.x + x;
            y = shdwGame.positionOffset.y + y;

            // create pattern
            var ptrn = shdwGame.resContext.createPattern(shdwBG.image, 'repeat'); // Create a pattern with this image, and set it to "repeat".
            shdwGame.resContext.fillStyle = ptrn;
            shdwGame.resContext.translate(x, y);
            shdwGame.resContext.fillRect(-x,-y,shdwGame.map.width, shdwGame.map.height); // context.fillRect(x, y, width, height);
            shdwGame.resContext.translate(-x, -y);
        }

        shdwBG.load(imagePath);
        shdwBG.x = 0;
        shdwBG.y = 0;
        shdwBG.isLoaded = false;
    }

    shdwGame.backgroundLayers = function(imagePath,ground,layer1){

        var shdwBG = this;

        shdwBG.ground = ground;
        shdwBG.layer1 = layer1;

        shdwBG.load = function(imagePath){
            var resImage = this;
            resImage.image = new Image();
            resImage.image.src = imagePath;
            resImage.image.onload = function(){
                resImage.isLoaded = true;
            }
        }

        shdwBG.drawFull = function(x,y){

            x = Math.round(shdwGame.positionOffset.x + x);
            y = Math.round(shdwGame.positionOffset.y + y);

            var tileSize = 32;       // The size of a tile (32×32)
            var rowTileCount = 20;   // The number of tiles in a row of our background
            var colTileCount = 32;   // The number of tiles in a column of our background
            var imageNumTiles = 16;  // The number of tiles per row in the tileset image

            for (var r = 0; r < rowTileCount; r++) {
                for (var c = 0; c < colTileCount; c++) {
                    var tile = shdwBG.ground[ r ][ c ];

                    var tileRow = (tile / imageNumTiles) | 0; // Bitwise OR operation
                    var tileCol = (tile % imageNumTiles) | 0;

                    shdwGame.resContext.drawImage(shdwBG.image,(tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize,(c * tileSize)+x, (r * tileSize)+y,tileSize,tileSize);
                }
            }

            for (var r = 0; r < rowTileCount; r++) {
                for (var c = 0; c < colTileCount; c++) {
                    var tile = shdwBG.layer1[ r ][ c ];

                    var tileRow = (tile / imageNumTiles) | 0; // Bitwise OR operation
                    var tileCol = (tile % imageNumTiles) | 0;

                    shdwGame.resContext.drawImage(shdwBG.image,(tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize,(c * tileSize)+x, (r * tileSize)+y,tileSize,tileSize);
                }
            }
        }

        shdwBG.load(imagePath);
        shdwBG.x = 0;
        shdwBG.y = 0;
        shdwBG.isLoaded = false;
    }
}