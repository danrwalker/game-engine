
    var ground = [
        [172, 172, 172, 79, 34, 34, 34, 34, 34, 34, 34, 34, 56, 57, 54, 55, 56, 147, 67, 67, 68, 79, 79, 171, 172, 172, 173, 79, 79, 55, 55, 55],
        [172, 172, 172, 79, 34, 34, 34, 34, 34, 34, 146, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 155, 142, 172, 159, 189, 79, 79, 55, 55, 55],
        [172, 172, 172, 79, 79, 34, 34, 34, 34, 34, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 172, 159, 189, 79, 79, 79, 55, 55, 55],
        [188, 188, 188, 79, 79, 79, 79, 34, 34, 34, 36, 172, 172, 143, 142, 157, 79, 79, 79, 79, 79, 79, 187, 159, 189, 79, 79, 79, 55, 55, 55, 55],
        [79, 79, 79, 79, 79, 79, 79, 79, 34, 34, 36, 172, 159, 158, 172, 143, 157, 79, 79, 79, 79, 79, 79, 79, 79, 79, 39, 51, 51, 51, 55, 55],
        [79, 79, 79, 79, 79, 79, 79, 79, 79, 34, 36, 172, 143, 142, 172, 172, 143, 157, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 55],
        [79, 79, 79, 79, 79, 79, 79, 79, 79, 34, 52, 172, 172, 172, 172, 172, 172, 143, 156, 157, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79],
        [79, 79, 79, 79, 79, 79, 79, 79, 79, 34, 52, 172, 172, 172, 172, 172, 172, 159, 188, 189, 79, 79, 79, 79, 79, 171, 172, 172, 173, 79, 79, 79],
        [79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 188, 158, 172, 172, 172, 172, 173, 79, 79, 79, 79, 79, 79, 79, 187, 158, 159, 189, 79, 79, 79],
        [79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 172, 172, 159, 188, 189, 79, 79, 79, 79, 79, 79, 79, 79, 171, 173, 79, 79, 79, 79],
        [79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 172, 172, 173, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 173, 79, 79, 79, 79],
        [155, 142, 157, 79, 79, 79, 79, 79, 79, 79, 79, 79, 187, 188, 188, 189, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 173, 79, 79, 79, 79],
        [171, 172, 173, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 173, 79, 79, 79, 79],
        [171, 172, 143, 156, 157, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 187, 189, 79, 79, 79, 79],
        [187, 188, 158, 172, 173, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79],
        [79, 79, 79, 188, 189, 79, 79, 79, 79, 79, 79, 155, 156, 156, 157, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 155, 156],
        [34, 34, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 172, 172, 173, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 155, 142, 172],
        [34, 34, 34, 79, 79, 79, 79, 79, 79, 79, 79, 171, 172, 172, 173, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 172, 172],
        [34, 34, 34, 34, 79, 79, 79, 79, 79, 79, 155, 172, 172, 159, 189, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 171, 172, 172],
        [34, 34, 34, 34, 34, 34, 79, 79, 79, 79, 171, 172, 172, 173, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 79, 155, 142, 172, 172]
    ];

    var layer1 = [
        [0, 0, 32, 33, 0, 236, 0, 0, 236, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 69, 0, 0, 0, 0, 0, 32, 33],
        [0, 0, 48, 49, 0, 236, 220, 220, 236, 0, 0, 147, 72, 73, 70, 71, 72, 73, 83, 83, 84, 85, 0, 0, 0, 0, 0, 48, 49],
        [0, 0, 64, 65, 54, 0, 236, 236, 0, 0, 162, 163, 84, 89, 86, 87, 88, 89, 99, 99, 100, 101, 0, 0, 0, 0, 7, 112, 113],
        [0, 0, 80, 81, 70, 54, 55, 50, 0, 0, 0, 179, 100, 105, 102, 103, 104, 105, 0, 0, 0, 0, 0, 0, 16, 22, 23, 39],
        [0, 0, 96, 97, 86, 70, 65, 144, 193, 0, 0, 37, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 49],
        [0, 0, 0, 0, 102, 86, 81, 160, 161, 0, 0, 37, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 65, 174, 175, 67, 66, 54],
        [0, 0, 0, 0, 0, 102, 97, 176, 177, 0, 0, 37, 0, 252, 0, 0, 0, 201, 202, 0, 0, 0, 0, 0, 80, 81, 190, 191, 83, 82, 70, 71],
        [0, 0, 0, 0, 0, 0, 0, 48, 49, 0, 0, 53, 0, 0, 0, 0, 0, 217, 218, 0, 0, 0, 0, 0, 96, 97, 222, 223, 99, 98, 86, 87],
        [201, 202, 0, 0, 0, 0, 0, 64, 65, 66, 68, 69, 0, 0, 0, 0, 0, 233, 234, 0, 0, 0, 0, 0, 238, 239, 0, 0, 238, 239, 102, 103],
        [217, 218, 0, 0, 0, 0, 0, 80, 81, 82, 84, 85, 0, 0, 0, 0, 0, 249, 250, 0, 0, 0, 0, 0, 254, 255, 0, 0, 254, 255],
        [233, 234, 0, 0, 0, 0, 0, 96, 97, 98, 100, 101, 0, 0, 0, 0, 0, 0, 0],
        [249, 250, 0, 0, 201, 202, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 238, 239, 0, 0, 238, 239],
        [0, 0, 0, 0, 217, 218, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 254, 255, 0, 0, 254, 255],
        [0, 0, 0, 0, 233, 234, 196, 197, 198],
        [2, 3, 4, 0, 249, 250, 228, 229, 230],
        [18, 19, 20, 8, 0, 0, 244, 245, 246, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 201, 202],
        [0, 35, 40, 24, 25, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 217, 218],
        [0, 0, 0, 40, 41, 20, 8, 9, 0, 0, 0, 0, 0, 0, 0, 16, 17, 18, 19, 20, 21, 0, 0, 0, 0, 0, 0, 0, 233, 234],
        [0, 0, 0, 0, 40, 19, 24, 25, 8, 9, 0, 0, 0, 0, 0, 48, 49, 50, 51, 52, 115, 3, 4, 0, 0, 0, 0, 0, 249, 250],
        [0, 0, 0, 0, 0, 0, 40, 41, 20, 21, 0, 0, 0, 0, 0, 64, 65, 66, 67, 52, 19, 19, 20, 21]
    ];

    var myGame = new GameEngine();
    myGame.create(512,480,24);
    //myGame.create(1024,640);
    myGame.keyboard();

    myGame.createSprite('grass',{ imagePath:"images/background.png", x:32, y:32, width:32, height:32 });
    myGame.createSprite('tree',{ imagePath:"images/background.png", x:0, y:0, width:32, height:32 });
    myGame.createSprite('monster',{ imagePath:"images/monster.png", x:0, y:0, width:32, height:32 });

    //myGame.map(1024,640);
    myGame.map(2048,1024);

    //myGame.setBackground("images/background.png");
    myGame.setBackgroundLayered("images/tileset.png",ground,layer1);
    //myGame.setBackgroundRepeat("images/background.png");

    myGame.createCharacter(4,"images/hero.png",true);

    var treasure = {
        x: 32 + (Math.random() * (myGame.resCanvas.width - 64)),
        y: 32 + (Math.random() * (myGame.resCanvas.height - 64))
    };

    var monster = {
        x: 32 + (Math.random() * (myGame.resCanvas.width - 64)),
        y: 32 + (Math.random() * (myGame.resCanvas.height - 64))
    };

    var life = 100;
    var points = 0;

    myGame.updateFrame(function(){

        if(myGame.checkProximity(myGame.resCharacter.mapX,myGame.resCharacter.mapY,treasure.x,treasure.y,32)){

            ++points;

            // Throw the monster somewhere on the screen randomly
            treasure.x = 32 + (Math.random() * (this.resCanvas.width - 64));
            treasure.y = 32 + (Math.random() * (this.resCanvas.height - 64));
        }

        if(myGame.checkProximity(myGame.resCharacter.mapX,myGame.resCharacter.mapY,monster.x,monster.y,32)){

            life = life - 10;
            //this.repositionCharacter(this.resCanvas.width / 2,this.resCanvas.height / 2);

            // Throw the monster somewhere on the screen randomly
            monster.x = 32 + (Math.random() * (this.resCanvas.width - 64));
            monster.y = 32 + (Math.random() * (this.resCanvas.height - 64));

        }else if(myGame.checkProximity(myGame.resCharacter.mapX,myGame.resCharacter.mapY,monster.x,monster.y,120)){
            monster = myGame.followCharacter(monster.x,monster.y,3);
        }

        this.sprites['tree'].draw(treasure.x,treasure.y);
        this.sprites['monster'].drawFull(monster.x,monster.y);

        //this.sprites['tree'].draw(50,82);
        //this.sprites['tree'].draw(50,82);
        //this.sprites['tree'].draw(50,114);
        //this.sprites['tree'].draw(50,146);
        //this.sprites['tree'].drawSolid(50,178);

        // Score
        this.resContext.fillStyle = "rgb(250, 250, 250)";
        this.resContext.font = "16px Helvetica";
        this.resContext.textAlign = "left";
        this.resContext.textBaseline = "top";
        this.resContext.fillText("Score: " + points, 32, 32);
        this.resContext.fillText("Life: " + life, 32, 50);

        if(life <= 0){
            this.resContext.fillStyle = "rgb(210, 64, 64)";
            this.resContext.font = "24px Helvetica";
            this.resContext.fillText("GAME OVER!", (this.resCanvas.width / 2) - 60,this.resCanvas.height / 2);
        }

        //this.resContext.fillText("Player: X " + myGame.resCharacter.mapX + " | Y " + myGame.resCharacter.mapY, 64, 64);
        //this.resContext.fillText("Monster: X " + monster.x + " | Y " + monster.y, 32, 64);
        //this.resContext.fillText("Char: X " + charX + " | Y " + charY, 32, 94);
        //this.resContext.fillText("Diff: X " + difference(charX,monster.x) + " | Y " + difference(charY,monster.y), 32, 94);
        //this.resContext.fillText("Mod: " + this.fpsInterval, 32, 94);

    });

    //Run the game
    myGame.run();
