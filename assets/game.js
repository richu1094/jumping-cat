const bgSound = new Audio("./sounds/bgmusic.mp3");
const dyingSound = new Audio("./sounds/ded.mp3");

const Game = {
  gameScreen: document.querySelector("#game-screen"),
  getPoints: document.querySelector("#points"),

  gameSize: {
    w: window.innerWidth / 3,
    h: window.innerHeight,
  },
  framesCounter: 0,

  background: undefined,
  player: undefined,
  platforms: [],
  fixedPlatform: [],
  canDie: false,
  isAlive: true,
  points: false,
  jumpCounter: 0,

  platformDensity: 40,

  keys: {
    LEFT: { code: "ArrowLeft", pressed: false },
    RIGHT: { code: "ArrowRight", pressed: false },
    UP: { code: "ArrowUp", pressed: false },
  },

  gameLoop() {
    bgSound.play();
    this.totalFrames();
    this.isCollision();
    this.isInitialCollision();
    this.drawAll();
    this.generatePlatforms();
    this.movementKeys();
    this.sideToSide();
    this.clearAll();
    this.finish();
    this.pointsCounter();
    window.requestAnimationFrame(() => this.gameLoop());
  },

  init() {
    this.setDimensions();
    this.start();
    this.setEventListeners();
    document.getElementById("game-container").style.display = "block";
  },

  setDimensions() {
    this.gameScreen.style.width = `${this.gameSize.w}px`;
    this.gameScreen.style.height = `${this.gameSize.h}px`;
  },

  start() {
    this.createElements();
    this.gameLoop();
  },

  setEventListeners() {
    document.addEventListener("keydown", (key) => {
      switch (key.code) {
        case this.keys.LEFT.code:
          this.keys.LEFT.pressed = true;
          break;
        case this.keys.RIGHT.code:
          this.keys.RIGHT.pressed = true;
          break;
      }
    });
    document.addEventListener("keyup", (key) => {
      switch (key.code) {
        case this.keys.LEFT.code:
          this.keys.LEFT.pressed = false;
          break;
        case this.keys.RIGHT.code:
          this.keys.RIGHT.pressed = false;
          break;
      }
    });
  },

  createElements() {
    this.background = new Background(this.gameScreen, this.gameSize);
    this.player = new Player(this.gameScreen, this.gameSize);
    this.fixedPlatform.push(new fixedPlatform(this.gameScreen, this.gameSize));
  },

  totalFrames() {
    this.framesCounter > 20000
      ? (this.framesCounter = 0)
      : this.framesCounter++;
  },

  drawAll() {
    this.player.move(this.framesCounter);
    this.platforms.forEach((elm) => {
      elm.move();
    });
  },

  generatePlatforms() {
    if (this.framesCounter % this.platformDensity === 0) {
      this.platforms.push(
        new Platform(
          this.gameScreen,
          this.gameSize,
          this.gameSize.w / 2,
          this.gameSize.h - 10
        )
      );
    }
  },

  clearAll() {
    this.platforms.forEach((eachPlatform, index) => {
      if (eachPlatform.platformPos.top > this.gameSize.h) {
        eachPlatform.gamePlatform.remove();
        this.platforms.splice(index, 1);
      }
    });
  },

  isCollision() {
    this.platforms.forEach((elm) => {
      if (
        this.player.square.x < elm.platformPos.left + elm.platformSize.w &&
        this.player.square.x + this.player.square.w > elm.platformPos.left &&
        this.player.square.y < elm.platformPos.top + elm.platformSize.h &&
        this.player.square.h + this.player.square.y > elm.platformPos.top
      ) {
        if (this.isAlive == true) {
          this.player.jump();
          this.jumpCounter++;
        }
        this.canDie = true;
      }
      this.player.square.base = this.gameSize.h;
    });
  },

  isInitialCollision() {
    this.fixedPlatform.forEach((elm) => {
      if (
        this.player.square.x < elm.platformPos.left + elm.platformSize.w &&
        this.player.square.x + this.player.square.w > elm.platformPos.left &&
        this.player.square.y < elm.platformPos.top + elm.platformSize.h &&
        this.player.square.h + this.player.square.y > elm.platformPos.top
      ) {
        if (this.isAlive == true) {
          this.player.jump();
        }
      }
      this.player.square.base = this.gameSize.h;
    });
  },

  sideToSide() {
    if (this.player.square.x + this.player.square.w < 0) {
      this.player.square.x = this.gameSize.w;
    } else if (this.player.square.x > this.gameSize.w) {
      this.player.square.x = -this.player.square.w;
    }
  },

  movementKeys() {
    if (this.keys.LEFT.pressed) {
      this.player.square.x -= 3;
      this.player.moveLeft();
    }

    if (this.keys.RIGHT.pressed) {
      this.player.square.x += 3;
      this.player.moveRight();
    }
  },

  finish() {
    if (this.canDie && this.player.square.y + 40 > this.gameSize.h) {
      this.isAlive = false;
      if (this.isAlive == true) {
        dyingSound.play();
      }
      this.gameScreen.style.display = "none";
      document.getElementById("game-over").style.display = "block";
      return;
    }
  },

  pointsCounter() {
    if (this.canDie) {
      this.getPoints.innerText = `${this.jumpCounter}`;
    }
  },
};
