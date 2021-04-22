import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js";
import Camera from "./camera.js";
import Player from "./player.js";
import Enemy from "./enemy.js";
import BossEnemy from "./bossEnemy.js";
import Star from "./star.js";

class Game {
  constructor() {
    this.container = document.querySelector(".container");
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

    this.enemies = [];
    this.totalEnemiesSpawned = 0;

    this.enemyShootInterval = null;
    this.started = false;
    this.bossActivated = false;
  }

  initRenderer = () => {
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
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

  loadSprites = async () => {
    this.player = new Player(this.scene, "../assets/new_ship-2.glb");
    await this.player.init();

    // this.bossEnemy = new BossEnemy(this.scene, "../assets/new_ship.glb");
    // await this.bossEnemy.init(this.window_width, this.window_height);

    this.enemies = [];
    this.stars = [];

    console.log("Done");
    this.startButton.textContent = "Start";
    this.startButton.style.cursor = "pointer";
  };

  init = async () => {
    this.initRenderer();
    this.loadScenebackground();
    this.setupEventListeners();

    await this.reInit();
  };

  reInit = async () => {
    document.querySelector(".end-screen").style.display = "none";

    document.querySelector(".start-screen").style.display = "flex";
    this.startButton.textContent = "Loading...";
    this.startButton.style.cursor = "auto";

    this.camera.resetPosition();
    await this.loadSprites();
    this.animate();
  };

  animate = async () => {
    // update tweening if any
    TWEEN.update();

    // move player
    this.player.move(this.window_width, this.window_height);

    // move player lasers
    this.player.shootNext();
    this.player.moveLasers(this.window_height);

    // animation loop for enemies
    if (!this.bossActivated) await this.animateEnemies();
    else this.animateBossEnemy();

    // if player is dead, end game
    if (this.player.dead) {
      this.endGame(false);
      return;
    }

    // animate boss enemies

    // // check if player has been hit
    // this.bossEnemy.checkIfHitPlayer(this.player);
    // document.querySelector(
    //   ".score-box__health"
    // ).textContent = `Health: ${Math.floor(this.player.health)}`;

    // // check if player is dead
    // if (this.player.dead) {
    //   this.endGame(false);
    //   return;
    // }

    // // check if enemy has been hit
    // this.bossEnemy.checkIfHit(this.player);
    // document.querySelector(
    //   ".score-box__score"
    // ).textContent = `Score: ${this.player.score}`;

    // // move enemy lasers
    // this.bossEnemy.moveLasers();

    // // remove dead enemies
    // this.bossEnemy.killDead();

    // // check if all enemies are dead
    // if (this.bossEnemy.isDead()) {
    //   this.endGame(true);
    //   console.log("Here");
    //   return;
    // }

    // generate star
    if (this.started) this.generateStar();

    // check if star obtained
    this.stars = this.player.checkIfStarObtained(this.stars);

    // render screen
    this.renderer.render(this.scene, this.camera.camera);
    requestAnimationFrame(this.animate);
  };

  animateEnemies = async () => {
    // move enemies
    this.enemies.forEach((enemy) => {
      enemy.move();

      // if enemy has passed player, game over
      if (enemy.sprite.position.z > this.window_height / 2 + 5)
        this.player.dead = true;
    });

    // check if enemies on screen have been hit
    this.enemies.forEach((enemy) => {
      if (enemy.sprite.position.z > -this.window_height / 2 + 2) {
        let dead;
        [this.player.lasers, dead] = enemy.checkIfHit(this.player.lasers);
        if (dead) this.player.score += 10;
      }
    });

    // kill dead enemies
    this.enemies = this.enemies.filter((enemy) => !enemy.dead);

    // check if boss enemy is to be activated
    if (this.totalEnemiesSpawned === 10) clearInterval(this.enemyShootInterval);

    // activate boss enemy once all inital enemies are killed
    if (this.totalEnemiesSpawned === 10 && this.enemies.length === 0) {
      this.bossActivated = true;

      this.bossEnemy = new BossEnemy(this.scene, "../assets/new_ship.glb");
      await this.bossEnemy.init(this.window_width, this.window_height);

      this.enemyShootInterval = setInterval(() => {
        this.bossEnemy.shoot({
          player_x: this.player.sprite.position.x,
          player_y: this.player.sprite.position.y,
        });
      }, 500);
    }
  };

  animateBossEnemy = () => {
    // check if player has been hit
    this.bossEnemy.checkIfHitPlayer(this.player);
    document.querySelector(
      ".score-box__health"
    ).textContent = `Health: ${Math.floor(this.player.health)}`;

    // check if player is dead
    if (this.player.dead) {
      this.endGame(false);
      return;
    }

    // check if enemy has been hit
    this.bossEnemy.checkIfHit(this.player);
    document.querySelector(
      ".score-box__score"
    ).textContent = `Score: ${this.player.score}`;

    // move enemy lasers
    this.bossEnemy.moveLasers();

    // remove dead enemies
    this.bossEnemy.killDead();

    // check if all enemies are dead
    if (this.bossEnemy.isDead()) {
      this.endGame(true);
      console.log("Here");
      return;
    }
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

    this.camera.startAnimation(() => {
      this.started = true;

      // this.enemyShootInterval = setInterval(async () => {
      //   this.bossEnemy.shoot({
      //     player_x: this.player.sprite.position.x,
      //     player_y: this.player.sprite.position.y,
      //   });
      // }, 500);

      this.enemyShootInterval = setInterval(async () => {
        const enemy = new Enemy(this.scene, "../assets/new_ship.glb", 2);
        await enemy.init(
          Math.random() * (this.window_width - 30) - this.window_width / 2 + 15,
          -this.window_height / 2
        );
        this.enemies.push(enemy);
        this.totalEnemiesSpawned++;
      }, 2500);
    });
  };

  endGame = (won) => {
    clearInterval(this.enemyShootInterval);
    this.started = false;

    this.player.remove();
    this.enemies.forEach((enemy) => enemy.remove());

    this.bossEnemy.remove();
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
