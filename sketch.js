var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("Walk1.png","Walk2.png");
  trex_collided = loadAnimation("hit1.png");
  
  groundImage = loadImage("BackgroundB.jpg");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("Bush1.png");
  
  obstacle2 = loadImage("Bush3.png");
  
  obstacle3 = loadImage("Rock1.png");
  
  
  
 
 
  
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  
  trex = createSprite(50,height-700,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.3;
  
  ground = createSprite(width/2,height-850,400,20);
  ground.scale = 1;
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  //ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(windowWidth/2,height-750);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,height-700);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-630,10000,10);
  invisibleGround.x = invisibleGround.width /2;
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    //ground.velocityX = -(6 + 3*score/100);
  
    if(touches.length > 0 || keyDown("space") && trex.y >= height-700 ) {
      touches = [];
      trex.velocityY = -15;
      console.log(touches);
    }

    if(keyDown(RIGHT_ARROW)){
      trex.x += 12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      //ground.x = ground.width/2;
    }

    camera.position.x = trex.x;
    //camera.position.y = trex.y;
  
    trex.collide(invisibleGround);
    trex.depth = trex.depth + 1;
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
  fill("white");
  strokeWeight(5)
  text("Score: "+ score, trex.x,height-800);
}



function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(displayWidth-100,displayHeight-660,100,40);
   
   
    //obstacle.debug = true;
   // obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
     
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    obstacle.x = trex.x + 800;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

