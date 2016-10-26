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
    gEngine.intScrollThreshold = 120;

    gEngine.fps = 0;
    gEngine.fpsInterval = 0;

    gEngine.paused = false;
    gEngine.pausedTime = 0;

    gEngine.defaultFont = "Helvetica";
    gEngine.defaultSize = 16;
    gEngine.defaultColor = "#888888";

    gEngine.startTime = 0;
    gEngine.lastFrameTime = 0;
    gEngine.elapsedTime = 0;

    gEngine.keyboardEnabled = false;
    gEngine.mouseEnabled = false;
    gEngine.touchEnabled = false;

    gEngine.mouse = {
        button:'',
        button_last: '',
        button_last_startpos: { x: 0, y: 0},
        button_last_endpos: { x: 0, y: 0},
        position: { x: 0, y: 0},
        scroll_last: ''
    };

    gEngine.touch = {
        touches:0,
        last_startpos: { x: 0, y: 0},
        last_endpos: { x: 0, y: 0},
        position: { x: 0, y: 0}
    };

    //Cross-browser support for requestAnimationFrame
    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

    gEngine.addKeyboard = function(){
        gEngine.keyboardEnabled = true;
        addEventListener("keydown", function(e){ gEngine.keysDown[e.keyCode] = true; }, false);
        addEventListener("keyup", function(e){ delete gEngine.keysDown[e.keyCode]; }, false);
    }

    gEngine.addMouse = function(){

        var mie = (navigator.appName == "Microsoft Internet Explorer");
        var left = mie ? 1 : 0;
        var right = 2;

        gEngine.mouseEnabled = true;
        var canvas = document.getElementById('gameWindow');

        canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };

        canvas.addEventListener("mousedown", function (e){

            if(e.button === left){
                gEngine.mouse.button = 'left';
            }else if(e.button === right){
                gEngine.mouse.button = 'right';
            }

            gEngine.mouse.button_last = gEngine.mouse.button;
            gEngine.mouse.button_last_startpos = getMousePos(canvas, e);

        }, false);

        canvas.addEventListener("mouseup", function (e){

            if(e.button === left){
                gEngine.mouse.button = '';
            }else if(e.button === right){
                gEngine.mouse.button = '';
            }

            gEngine.mouse.button_last_endpos = getMousePos(canvas, e);

        }, false);

        canvas.addEventListener("mousemove", function (e){

            gEngine.mouse.position = getMousePos(canvas, e);

        }, false);

        // IE9+, Chrome, Safari, Opera
        canvas.addEventListener("mousewheel", function (e){

            // cross-browser wheel delta
            var e = window.event || e; // old IE support
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

            gEngine.mouse.scroll_last = (delta == '1') ? 'up' : 'down';

        }, false);

        // Firefox
        canvas.addEventListener("DOMMouseScroll", function (e){

            // In this case, we’re going to reverse Firefox’s detail value and return either 1 for up or -1 for down:
            var e = window.event || e; // old IE support
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

            gEngine.mouse.scroll_last = (delta == '1') ? 'up' : 'down';

        }, false);

    }

    // Get the position of the mouse relative to the canvas
    gEngine.getMousePos = function(canvasDom, mouseEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top
        };
    }

    gEngine.addTouch = function(dispatchMouseEvents){

        gEngine.touchEnabled = true;
        var canvas = document.getElementById('gameWindow');
        dispatchMouseEvents = (dispatchMouseEvents == undefined) ? false : true;

        // Prevent scrolling when touching the canvas
        document.body.addEventListener("touchstart", function (e) {
            if(e.target == canvas){
                e.preventDefault();
            }
        }, false);

        document.body.addEventListener("touchend", function (e) {
            if(e.target == canvas){
                e.preventDefault();
            }
        }, false);

        document.body.addEventListener("touchmove", function (e) {
            if(e.target == canvas){
                e.preventDefault();
            }
        }, false);

        //Setup the touch events
        canvas.addEventListener("touchstart", function(e){

            //Get the total number of touches
            gEngine.touch.touches = e.touches.length;

            //Track the main touch (item 0) -- In the future we can add in multi touch tracking by running though the array
            gEngine.touch.last_startpos = {x: e.touches[0].clientX, y: e.touches[0].clientY }
            gEngine.touch.position = {x: e.touches[0].clientX, y: e.touches[0].clientY }

            //Pass on to mouse events (optional) so that additional events dont need to be coded
            if(dispatchMouseEvents){

                var touch = e.touches[0];
                var mouseEvent = new MouseEvent("mousedown",{
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });

                canvas.dispatchEvent(mouseEvent);
            }

        }, false);

        canvas.addEventListener("touchend", function(e){

            //Track the main touch (item 0) -- In the future we can add in multi touch tracking by running though the array
            gEngine.touch.touches = 0;
            gEngine.touch.last_endpos = {x: e.touches[0].clientX, y: e.touches[0].clientY }
            gEngine.touch.position = {x: e.touches[0].clientX, y: e.touches[0].clientY }

            if(dispatchMouseEvents){

                var touch = e.touches[0];
                var mouseEvent = new MouseEvent("mouseup",{
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });

                canvas.dispatchEvent(mouseEvent);
            }

        }, false);

        canvas.addEventListener("touchmove", function(e){

            //Track the main touch (item 0) -- In the future we can add in multi touch tracking by running though the array
            gEngine.touch.position = {x: e.touches[0].clientX, y: e.touches[0].clientY }

            if(dispatchMouseEvents){

                var touch = e.touches[0];
                var mouseEvent = new MouseEvent("mousemove",{
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });

                canvas.dispatchEvent(mouseEvent);
            }

        }, false);
    }

    gEngine.getTouchPos = function(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }

    gEngine.windowsize = function(){
        var w = 0;var h = 0;
        //IE
        if(!window.innerWidth){
            if(!(document.documentElement.clientWidth == 0)){
                //strict mode
                w = document.documentElement.clientWidth;h = document.documentElement.clientHeight;
            } else{
                //quirks mode
                w = document.body.clientWidth;h = document.body.clientHeight;
            }
        } else {
            //w3c
            w = window.innerWidth;h = window.innerHeight;
        }
        return {width:w,height:h};
    }

    gEngine.deviceOS = function(){
        var useragent = navigator.userAgent;

        if(useragent.match(/Android/i)) {
            return 'android';
        } else if(useragent.match(/webOS/i)) {
            return 'webos';
        } else if(useragent.match(/iPhone/i)) {
            return 'iphone';
        } else if(useragent.match(/iPod/i)) {
            return 'ipod';
        } else if(useragent.match(/iPad/i)) {
            return 'ipad';
        } else if(useragent.match(/Windows Phone/i)) {
            return 'windows phone';
        } else if(useragent.match(/SymbianOS/i)) {
            return 'symbian';
        } else if(useragent.match(/RIM/i) || useragent.match(/BB/i)) {
            return 'blackberry';
        } else {
            return false;
        }
    }

    gEngine.create = function(width,height,frameRate){

        var sizes = gEngine.windowsize();

        width = (width == undefined || width == null) ? sizes.width : width;
        height = (height == undefined || height == null) ? sizes.height : height;

        //Set the framerate of the game, default is 24/fps
        gEngine.fps = (frameRate == undefined) ? 24 : frameRate;
        gEngine.fpsInterval = 1000 / gEngine.fps;

        gEngine.lastFrameTime = Date.now();

        document.body.style.cssText = "margin: 0; background-color: #000;";

        //Create a container
        var container = document.createElement("div");
        container.id = "gameContainer";
        container.style.cssText = "position: relative;";

        //Create the canvas -- Add more canvases in the future to minimize redraws
        gEngine.resCanvas = document.createElement("canvas");
        gEngine.resCanvas.id = "gameWindow";
        gEngine.resCanvas.style.cssText = "position: absolute; left: 0; top: 0; z-index: 0;";
        gEngine.resCanvas.width = gEngine.map.width = width;
        gEngine.resCanvas.height = gEngine.map.height = height;

        gEngine.resContext = gEngine.resCanvas.getContext("2d");

        if(gEngine.deviceOS() == 'ipad' || gEngine.deviceOS() == 'ipad'){
            var ipadFixLink = document.createElement("a");
            ipadFixLink.id = "ipadFix";
            ipadFixLink.style.cssText = "position: absolute; z-index:100; width:120px; text-align:center; padding:16px; display:block; background-color:#000; color:#FFF;";
            ipadFixLink.href = "javascript:myGame.audio().ipadFix(); document.getElementById('ipadFix').style.cssText='display:none';";
            ipadFixLink.innerText = "Enable Audio";

            container.appendChild(ipadFixLink);
        }

        container.appendChild(gEngine.resCanvas);
        document.body.appendChild(container);
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

            if(gEngine.paused){

                //Press P to resume the game
                if(80 in gEngine.keysDown){
                    gEngine.resume();
                }

            }else{

                //Clear the window before redraw
                gEngine.clear();

                //if(gEngine.touchEnabled && gEngine.touch.touches > 0){
                //    gEngine.resCharacter.repositionCharacter(gEngine.touch.position.x,gEngine.touch.position.y);
                //}

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

                //Press P to pause the game
                if(80 in gEngine.keysDown){
                    gEngine.pause();
                }
            }
        }
    }

    gEngine.pause = function(){

        if(Date.now() > gEngine.pausedTime + 1000){
            gEngine.paused = true;
            gEngine.audio().pauseAll();
            gEngine.dialog().pause((gEngine.resCanvas.width/2)-120,(gEngine.resCanvas.height/2)-25,240,50);
            gEngine.pausedTime = Date.now();
        }
    }

    gEngine.resume = function(){

        if(Date.now() > gEngine.pausedTime + 1000){
            gEngine.paused = false;
            gEngine.audio().resumeAll();
            gEngine.pausedTime = Date.now();
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
        gEngine.resCharacter.score = 0;
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

        XPos = 20
        YPos = (gEngine.resCanvas.height - gEngine.sprites['arrowkeys'].height) - 20;

        //Calculate the new positions of the character or everything else
        if(arrKeyOrder[0] in gEngine.keysDown ||
            (gEngine.touch.touches > 0 && gEngine.checkProximity(gEngine.touch.position.x,gEngine.touch.position.y,136,YPos+4,0,0,100,100))){ // Player holding up
            y -= intCurrentSpeed;
        }

        if(arrKeyOrder[1] in gEngine.keysDown ||
            (gEngine.touch.touches > 0 && gEngine.checkProximity(gEngine.touch.position.x,gEngine.touch.position.y,140,YPos+118,0,0,96,100))){ // Player holding down
            y += intCurrentSpeed;
        }

        if(arrKeyOrder[2] in gEngine.keysDown ||
            (gEngine.touch.touches > 0 && gEngine.checkProximity(gEngine.touch.position.x,gEngine.touch.position.y,34,YPos+118,0,0,96,100))){ // Player holding left
            x -= intCurrentSpeed;
        }

        if(arrKeyOrder[3] in gEngine.keysDown ||
            (gEngine.touch.touches > 0 && gEngine.checkProximity(gEngine.touch.position.x,gEngine.touch.position.y,250,YPos+118,0,0,96,100))){ // Player holding right
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

                if(y == gEngine.resCharacter.mapY){
                    gEngine.resCharacter.direction = '';
                }else{
                    gEngine.resCharacter.direction = (y > gEngine.resCharacter.mapY) ? 'south' : 'north';
                }

                if(x == gEngine.resCharacter.mapX){
                    gEngine.resCharacter.direction += '';
                }else{
                    gEngine.resCharacter.direction += (gEngine.resCharacter.direction != '') ? '-' : '';
                    gEngine.resCharacter.direction += (x > gEngine.resCharacter.mapX) ? 'east' : 'west';
                }

                characterX = resMoveItem.x;
                characterY = resMoveItem.y;

                intNewOffsetX = resMoveItem.x - (gEngine.resCanvas.width - gEngine.intScrollThreshold)
                intNewOffsetY = resMoveItem.y - (gEngine.resCanvas.height - gEngine.intScrollThreshold)

                blEdgeRightX = (characterX >= (gEngine.resCanvas.width - gEngine.intScrollThreshold))
                blEdgeBottomY = (characterY >= (gEngine.resCanvas.height - gEngine.intScrollThreshold))

                blEdgeLeftX = (characterX <= gEngine.intScrollThreshold)
                blEdgeTopY = (characterY <= gEngine.intScrollThreshold)

                if(blEdgeTopY){
                    //console.log('top');
                    //gEngine.positionOffset.y = resMoveItem.y;
                    //characterY = gEngine.intScrollThreshold;
                }

                if(blEdgeRightX){
                    //console.log('right');
                    gEngine.positionOffset.x = intNewOffsetX;

                    if((gEngine.positionOffset.x + gEngine.resCanvas.width) < gEngine.map.width){
                        characterX = gEngine.resCanvas.width - gEngine.intScrollThreshold;
                    }else{
                        characterX = (gEngine.resCanvas.width - gEngine.intScrollThreshold) + (gEngine.positionOffset.x + gEngine.resCanvas.width) - gEngine.map.width;
                    }
                }

                if(blEdgeBottomY){
                    //console.log('bottom');
                    gEngine.positionOffset.y = intNewOffsetY

                    if((gEngine.positionOffset.y + gEngine.resCanvas.height) < gEngine.map.height){
                        characterY = gEngine.resCanvas.height - gEngine.intScrollThreshold;
                    }else{
                        characterY = (gEngine.resCanvas.height - gEngine.intScrollThreshold) + (gEngine.positionOffset.y + gEngine.resCanvas.height) - gEngine.map.height;
                    }
                }

                if(blEdgeLeftX){
                    //console.log('left');
                    //gEngine.positionOffset.x = resMoveItem.x;
                    //characterX = gEngine.intScrollThreshold;
                }

                gEngine.backgroundImage.drawFull(0,0);
                resMoveItem.avatar.drawFull(characterX,characterY)
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

    gEngine.collectableList = [];

    gEngine.collectable = function(spriteReference,respawn,event,x,y){

        width = gEngine.sprites[spriteReference].width;
        height = gEngine.sprites[spriteReference].height;

        x = (x == null || x == undefined) ? (Math.random() * gEngine.resCanvas.width) - width : x;
        y = (y == null || y == undefined) ? (Math.random() * gEngine.resCanvas.height) - height : y;

        gEngine.collectableList[gEngine.collectableList.length] = {
            sprite: spriteReference,
            respawn: (respawn == null || respawn == undefined) ? false : respawn,
            event: (event == null || event == undefined) ? function(){} : event,
            x: x,
            y: y,
            width: width,
            height: height
        };
    }

    gEngine.drawCollectables = function(){

        for(var intKey in gEngine.collectableList){

            resEachItem = gEngine.collectableList[intKey];

            if(gEngine.checkProximity(gEngine.resCharacter.mapX,gEngine.resCharacter.mapY,resEachItem.x,resEachItem.y,0,0,resEachItem.width,resEachItem.height)){

                resEachItem.event(gEngine);

                if(resEachItem.respawn){
                    gEngine.collectableList[intKey]['x'] = (Math.random() * gEngine.resCanvas.width) - resEachItem.width;
                    gEngine.collectableList[intKey]['y'] = (Math.random() * gEngine.resCanvas.height) - resEachItem.height;
                }else{
                    //Remove the item from the list of collectables
                    delete gEngine.collectableList[intKey];
                }
            }

            gEngine.sprites[resEachItem.sprite].draw(resEachItem.x,resEachItem.y);
        }
    }

    gEngine.checkProximity = function(posX,posY,locationX,locationY,proximityX,proximityY,width,height){

        var testX,testY = false

        //Match proximityX if proximityY is not test
        proximityY = (proximityY == null || proximityY == undefined) ? proximityX : proximityY;

        //Assume the area in question is a single point unslee otherwise stated
        width = (width == null || width == undefined) ? 1 : width;
        height = (height == null || height == undefined) ? 1 : height;

        var intDiffX = gEngine.difference(posX,locationX);
        var intDiffY = gEngine.difference(posY,locationY);

        //Test X axis
        if(width == 1 && intDiffX < proximityX){
            testX = true;
        }else if(width > 1 && ((posX <= locationX && intDiffX <= proximityX) || (posX > locationX && intDiffX <= (width + proximityX)))){
            testX = true;
        }

        //Test Y Axis
        if(height == 1 && intDiffY < proximityY){
            testY = true;
        }else if(height > 1 && ((posY <= locationY && intDiffY <= proximityY) || (posY > locationY && intDiffY <= (height + proximityY)))){
            testY = true;
        }

        return (testX && testY);
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
                if(gAudioFiles.hasOwnProperty(mxdReference) && gAudioFiles[mxdReference].duration > 0 && gAudioFiles[mxdReference].loop){
                    gAudioFiles[mxdReference].play();
                }
            }
        }

        gAudio.ipadFix = function(){

            //Resume all audio files that have been paused
            for(var mxdReference in gAudioFiles){
                gAudioFiles[mxdReference].play();
                gAudioFiles[mxdReference].pause();
                gAudioFiles[mxdReference].currentTime = 0;
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

            if(gEngine.resCharacter.centerLock){
                x = gEngine.positionOffset.x + x;
                y = gEngine.positionOffset.y + y;
            }

            gEngine.resContext.drawImage(gSprite.image,x,y);
        }

        gSprite.draw = function(x,y,opacity){

            if(gEngine.resCharacter.centerLock){
                x = gEngine.positionOffset.x + x;
                y = gEngine.positionOffset.y + y;
            }

            if(opacity != undefined){
                gEngine.resContext.globalAlpha = opacity
            }

            gEngine.resContext.drawImage(gSprite.image, gSprite.x, gSprite.y, gSprite.width, gSprite.height, x, y, gSprite.width, gSprite.height);

            if(opacity != undefined){
                gEngine.resContext.globalAlpha = 1
            }
        }

        gSprite.drawSolid = function(x,y){

            if(gEngine.resCharacter.centerLock){
                x = gEngine.positionOffset.x + x;
                y = gEngine.positionOffset.y + y;
            }

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

        gDialog.pause = function(x,y,width,height){
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

            y = gEngine.positionOffset.y + y;
            x = gEngine.positionOffset.x + x;

            // create pattern
            var ptrn = gEngine.resContext.createPattern(gBackground.image, 'repeat'); // Create a pattern with this image, and set it to "repeat".
            gEngine.resContext.fillStyle = ptrn;

            //Reverse the direction of the background scroll between center lock and regular
            if(gEngine.resCharacter.centerLock){
                gEngine.resContext.translate(x, y);
                gEngine.resContext.fillRect(-x,-y,gEngine.map.width, gEngine.map.height); // context.fillRect(x, y, width, height);
                gEngine.resContext.translate(-x, -y);
            }else{
                gEngine.resContext.translate(-x, -y);
                gEngine.resContext.fillRect(x,y,gEngine.map.width, gEngine.map.height); // context.fillRect(x, y, width, height);
                gEngine.resContext.translate(x, y);
            }
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

                    if(gEngine.resCharacter.centerLock){
                        gEngine.resContext.drawImage(gBackground.image,(tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize,(c * tileSize)+x, (r * tileSize)+y,tileSize,tileSize);
                    }else{
                        gEngine.resContext.drawImage(gBackground.image,(tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize,(c * tileSize)-x, (r * tileSize)-y,tileSize,tileSize);
                    }
                }
            }

            for (var r = 0; r < rowTileCount; r++) {
                for (var c = 0; c < colTileCount; c++) {
                    var tile = gBackground.layer1[ r ][ c ];

                    var tileRow = (tile / imageNumTiles) | 0; // Bitwise OR operation
                    var tileCol = (tile % imageNumTiles) | 0;

                    if(gEngine.resCharacter.centerLock){
                        gEngine.resContext.drawImage(gBackground.image,(tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize,(c * tileSize)+x, (r * tileSize)+y,tileSize,tileSize);
                    }else{
                        gEngine.resContext.drawImage(gBackground.image,(tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize,(c * tileSize)-x, (r * tileSize)-y,tileSize,tileSize);
                    }
                }
            }
        }

        gBackground.load(imagePath);
        gBackground.x = 0;
        gBackground.y = 0;
        gBackground.isLoaded = false;
    }
}