const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var END = 0;
var PLAY = 1;
var score= 0;
var gameState = PLAY;
var engine, world;
var cano, cano2, bird, backgroundImg, coin, gameOver;
var canoImg, cano2Img, canograndeImg, cano2grandeimg, birdImg, coinImg, gameOverImg;
var canoGrupo, canoGrupo2, coinGroupo
var bgSound

function preload() {
  canoImg = loadImage("./assets/cano1.png");
  cano2Img = loadImage("./assets/cano2.png");
  birdImg = loadImage("./assets/flappy.png");
  coinImg = loadImage("./assets/moeda.png");
  gameOverImg = loadImage("./assets/gameOver.png");
  backgroundImg = loadImage("./assets/background.jpg");
  canograndeImg = loadImage("./assets/cano1-grande.png");
  cano2grandeimg = loadImage("./assets/cano2-grande.png");
  bgSound=loadSound("./assets/flowers.mp3")
}

function setup() {
  createCanvas(1500, 700);
  engine = Engine.create();
  world = engine.world;

  bgSound.play()
  
  bird = createSprite(75, 360, 65, 65);
  bird.addImage(birdImg);
  bird.scale = 0.3;
  bird.setCollider("circle", 0, 0, 63);

  gameOver = createSprite(width / 2 - 55, height / 2 - 55, 100, 100);
  gameOver.addImage(gameOverImg);
  gameOver.depth = gameOver.depth + 2
  gameOver.visible = false;

  canoGrupo = new Group();
  canoGrupo2 = new Group();
  coinGroupo = new Group();
}

function draw() {
  background(0);
  image(backgroundImg, 0, 0, 1500, 700);

  if (bird.isTouching(canoGrupo) || bird.isTouching(canoGrupo2)) {
    gameState = END;
  }

  if (gameState == PLAY) {
    gameOver.visible = false;
    bird.velocityY += 0.5;
    if (bird.y < 30) {
      bird.y += 2;
    } else if (bird.y > 550) {
      bird.y -= 2;
    }

    if (bird.y > 600) {
      gameState = END;
    }

    if (keyWentDown("W") && bird.y > 45) {
      bird.velocityY = -5;
    }
    Fcano1();
    Fcano2();
    coins()
  }

  if (gameState == END) {
    if (keyDown("R")) {
      reset();
    }
   
    canoGrupo.setVelocityXEach(0);
    canoGrupo2.setVelocityXEach(0);
    coinGroupo.setVelocityXEach(0);
    canoGrupo.setLifetimeEach(-1);
    canoGrupo2.setLifetimeEach(-1);
    coinGroupo.setLifetimeEach(-1);
    bird.setVelocity(0, 0);
    gameOver.visible = true;
    
    fill("black");
    textSize(40);
    text("Pressione 'R' para reiniciar", width / 2 - 275, height / 2);
    
  }

  push();
  imageMode(CENTER);
  pop();

  text("X: " + mouseX + "/ Y: " + mouseY, mouseX, mouseY);
  drawSprites();
  Engine.update(engine);
}

function Fcano1() {
  if (frameCount % 50 == 0) {
    cano = createSprite(1500, 700, 150, 50);
    cano.debug = false;
    cano.setCollider("rectangle", 0, 0, 350, 1250);
    cano.velocityX = Math.round(random(-5, -9));
    cano.lifetime = width / cano.velocityX;
    canoGrupo.add(cano);
    var soft = Math.round(random(1, 2));
    switch (soft) {
      case 1:
        cano.addImage(canoImg);
        cano.scale = random(0.3, 0.4);
        break;
      case 2:
        cano.addImage(canograndeImg);
        cano.scale = random(0.3, 0.4);
        break;
    }
  }
}

function Fcano2() {
  if (frameCount % 75 == 0) {
    cano2 = createSprite(1500, -5, 150, 50);
    cano2.debug = false;
    cano2.setCollider("rectangle", 0, 0, 350, 1250);
    cano2.velocityX = Math.round(random(-5, -9));
    cano2.lifetime = width / cano2.velocityX;
    canoGrupo2.add(cano2);
    var soft = Math.round(random(1, 2));
    switch (soft) {
      case 1:
        cano2.addImage(cano2Img);
        cano2.scale = random(0.4, 0.5);
        break;
      case 2:
        cano2.addImage(cano2grandeimg);
        cano2.scale = random(0.2, 0.3);
        break;
    }
  }
}

function coins() {
  if (frameCount % 75 == 0) {
    coin = createSprite(1500,random(50,650));
    coin.addImage(coinImg)
    coin.scale=random(0.1,0.05)
    coin.velocityX = Math.round(random(-5, -9));
    coin.debug = false;
    coin.setCollider("circle", 0, 0, 250);
    coin.lifetime = width / coin.velocityX;
    coin.depth = bird.depth-1
    coinGroupo.add(coin);
  }

  bird.overlap(coinGroupo, function(collector, collected) {
    score+=21
    collected.remove();
  });

  fill("black");
  textSize(40);
  text("score: " + score, 50,50);
}

function reset() {
  gameOver.visible = false;
  canoGrupo.destroyEach();
  canoGrupo2.destroyEach();
  coinGroupo.destroyEach()
  bird.x = 75;
  bird.y = 360;
  bird.scale = 0.3;
  bird.velocityY = 0;
  gameState = PLAY;
}
