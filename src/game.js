import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js";
import Camera from "./camera.js";
import Player from "./player.js";
import Enemy from "./enemy.js";
import BossEnemy from "./bossEnemy.js";
import Star from "./star.js";
import loadModel from "./modelLoader.js";
import AudioPlayer from "./audioPlayer.js";

class Game {
  constructor() {
    this.container = document.querySelector(".game-container");
    this.startButton = document.querySelector(".start-screen__start");

    this.scene = new THREE.Scene();
    this.camera = new Camera(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.calculateVisibleRegion();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    const pointLight = new THREE.PointLight(0xffffff, 2.1);
    pointLight.position.set(0, 1000, 0);
    this.scene.add(pointLight);

    this.numberOfEnemies = 20;
    this.enemySpawnInterval = null;

    this.numberOfBossEnemies = 5;
    this.bossEnemyShootInterval = null;

    this.audio = new AudioPlayer("../assets/background.mp3");
  }

  initRenderer = () => {
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
  };

  initSprites = () => {
    this.player = new Player(this.scene, this.playerModel);
    this.player.init();

    this.enemies = [];
    this.stars = [];

    this.bossActivated = false;
    this.totalEnemiesSpawned = 0;
    this.totalBossEnemiesSpawned = 0;
    this.started = false;

    console.log("Done");
  };

  loadScenebackground = () => {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      "../assets/space/space-posx.jpg",
      "../assets/space/space-negx.jpg",
      "../assets/space/space-posy.jpg",
      "../assets/space/space-negy.jpg",
      "../assets/space/space-posz.jpg",
      "../assets/space/space-negz.jpg",
    ]);
    this.scene.background = texture;
  };

  loadModels = async () => {
    // load player model
    await loadModel("../assets/new_ship-2.glb").then((gltf) => {
      this.playerModel = gltf.scene;
    });

    // load enemy model
    await loadModel("../assets/new_ship.glb").then((gltf) => {
      this.enemyModel = gltf.scene;
    });
  };

  init = async () => {
    this.initRenderer();
    this.loadScenebackground();

    await this.loadModels();
    await this.audio.loadAudio();

    this.setupEventListeners();
    this.reInit();
  };

  reInit = () => {
    document.querySelector(".end-screen").style.display = "none";

    document.querySelector(".start-screen").style.display = "flex";
    this.startButton.textContent = "Loading...";
    this.startButton.style.cursor = "auto";

    this.camera.resetPosition();
    this.initSprites();

    document.querySelector(
      ".score-box__score"
    ).textContent = `Score: ${this.player.score}`;
    document.querySelector(
      ".score-box__health"
    ).textContent = `Health: ${Math.floor(this.player.health)}`;

    this.startButton.textContent = "Start";
    this.startButton.style.cursor = "pointer";

    this.animate();
  };

  animate = () => {
    // update tweening if any
    TWEEN.update();

    // move player
    this.player.move(this.window_width, this.window_height);

    // move player lasers
    this.player.shootNext();
    this.player.moveLasers(this.window_height);

    // animation loop for enemies
    if (!this.bossActivated) this.animateEnemies();
    else this.animateBossEnemy();

    // if player is dead, end game
    if (this.player.dead) {
      this.endGame(false);
      return;
    }

    // if boss is dead, end game or activate next boss
    if (this.bossActivated && this.bossEnemy.isDead()) {
      if (this.totalBossEnemiesSpawned === this.numberOfBossEnemies) {
        this.endGame(true);
        return;
      } else {
        this.activateBossEnemy();
      }
    }

    // generate star
    if (this.started) this.generateStar();

    // remove stars
    this.stars = this.stars.filter((star) => {
      const time = (new Date() - star.timeOfGeneration) / 1000;
      if (time > 10) star.remove();
      return time <= 10;
    });

    // check if star obtained
    this.stars = this.player.checkIfStarObtained(this.stars);

    // render screen
    this.renderer.render(this.scene, this.camera.camera);
    requestAnimationFrame(this.animate);
  };

  activateEnemies = () => {
    this.bossActivated = false;
    this.enemies = [];
    this.totalEnemiesSpawned = 0;

    clearInterval(this.enemySpawnInterval);
    clearInterval(this.bossEnemyShootInterval);
    this.enemySpawnInterval = setInterval(() => {
      const enemy = new Enemy(this.scene, this.enemyModel, 2);
      enemy.init(
        Math.random() * (this.window_width - 30) - this.window_width / 2 + 15,
        -this.window_height / 2 - 3
      );
      this.enemies.push(enemy);
      this.totalEnemiesSpawned++;
    }, 2200);
  };

  animateEnemies = () => {
    // move enemies
    this.enemies.forEach((enemy) => {
      enemy.move();

      // if enemy has passed player, game over
      if (enemy.sprite.position.z > this.window_height / 2 + 5)
        this.player.dead = true;
    });

    // check if player and enemy collided
    this.enemies.forEach((enemy) => {
      if (this.player.checkCollision(enemy)) this.player.dead = true;
    });

    // check if enemies on screen have been hit
    this.enemies.forEach((enemy) => {
      if (enemy.sprite.position.z > -this.window_height / 2 + 2) {
        let dead;
        [this.player.lasers, dead] = enemy.checkIfHit(this.player.lasers);
        if (dead) this.player.score += 10;
      }
    });
    document.querySelector(
      ".score-box__score"
    ).textContent = `Score: ${this.player.score}`;

    // kill dead enemies
    this.enemies = this.enemies.filter((enemy) => !enemy.dead);

    // check if boss enemy is to be activated
    if (this.totalEnemiesSpawned === this.numberOfEnemies)
      clearInterval(this.enemySpawnInterval);

    // activate boss enemy once all inital enemies are killed
    if (
      this.totalEnemiesSpawned === this.numberOfEnemies &&
      this.enemies.length === 0
    ) {
      this.activateBossEnemy();
    }
  };

  activateBossEnemy = () => {
    this.bossActivated = true;
    this.totalBossEnemiesSpawned++;

    this.bossEnemy = new BossEnemy(
      this.scene,
      this.enemyModel,
      this.totalBossEnemiesSpawned
    );
    this.bossEnemy.init(this.window_width, this.window_height);
    this.bossEnemy.animateIn();

    clearInterval(this.enemySpawnInterval);
    clearInterval(this.bossEnemyShootInterval);
    this.bossEnemyShootInterval = setInterval(() => {
      this.bossEnemy.shoot({
        player_x: this.player.sprite.position.x,
        player_y: this.player.sprite.position.y,
      });
    }, 500);
  };

  animateBossEnemy = () => {
    // check if player has been hit
    this.bossEnemy.checkIfHitPlayer(this.player);
    document.querySelector(
      ".score-box__health"
    ).textContent = `Health: ${Math.floor(this.player.health)}`;

    // check if enemy has been hit
    this.bossEnemy.checkIfHit(this.player);
    document.querySelector(
      ".score-box__score"
    ).textContent = `Score: ${this.player.score}`;

    // move enemy lasers
    this.bossEnemy.moveLasers();

    // remove dead enemies
    this.bossEnemy.killDead();
  };

  generateStar = () => {
    if (Math.random() > 0.995) {
      const star = new Star(this.scene);
      star.sprite.position.set(
        Math.random() * (this.window_width - 30) - this.window_width / 2 + 15,
        0,
        Math.random() * (this.window_height - 24) - this.window_height / 2 + 12
      );
      this.stars.push(star);
    }
  };

  startGame = () => {
    document.querySelector(".start-screen").style.display = "none";
    document.querySelector(".score-box").style.display = "block";

    // play background music
    if (!this.audio.playing) this.audio.play();

    this.camera.startAnimation(() => {
      this.started = true;
      this.activateEnemies();
    });
  };

  endGame = (won) => {
    clearInterval(this.enemySpawnInterval);
    clearInterval(this.bossEnemyShootInterval);

    this.player.remove();
    this.enemies.forEach((enemy) => enemy.remove());

    if (this.bossActivated) this.bossEnemy.remove();
    this.stars.forEach((star) => star.remove());

    document.querySelector(
      ".end-screen__score"
    ).textContent = `Score: ${this.player.score}`;
    document.querySelector(".end-screen").style.display = "flex";

    document.querySelector(".end-screen__title").textContent = won
      ? "You won!"
      : "Game over";

    document.querySelector(".score-box").style.display = "none";
  };

  calculateVisibleRegion = () => {
    const vFOV = THREE.MathUtils.degToRad(this.camera.camera.fov);
    this.window_height = 2 * Math.tan(vFOV / 2) * this.camera.height;
    this.window_width = this.camera.height * this.camera.camera.aspect;
  };

  handleWindowResize = () => {
    this.camera.resetAspectRatio(
      this.container.clientWidth,
      this.container.clientHeight
    );

    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    this.calculateVisibleRegion();
  };

  setupEventListeners = () => {
    window.addEventListener("resize", this.handleWindowResize);
    this.startButton.addEventListener("click", this.startGame);

    document
      .querySelector(".end-screen__restart")
      .addEventListener("click", this.reInit);
  };
}

export default Game;
