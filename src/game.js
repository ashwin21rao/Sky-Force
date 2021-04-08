import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js";
import Camera from "./camera.js";
import Player from "./player.js";
import Enemy from "./enemy.js";

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

    this.ambientLight = new THREE.AmbientLight(0xffffff, 3);
    this.scene.add(this.ambientLight);
  }

  init = async () => {
    this.initRenderer();
    this.loadScenebackground();
    this.setupEventListeners();

    await this.loadSprites();
    this.animate();
  };

  loadSprites = async () => {
    this.player = new Player(this.scene, "../assets/lancer-ii/Stingray.glb");
    await this.player.init();

    const number_of_enemies = 20;
    this.enemies = Array.from(
      { length: number_of_enemies },
      () => new Enemy(this.scene, "../assets/lancer-ii/Stingray.glb")
    );

    const width = this.window_width;
    for (const [i, enemy] of this.enemies.entries()) {
      await enemy.init(
        (width * i) / number_of_enemies - width / 2,
        -this.window_height / 2 + 3
      );
    }

    console.log("Done");
    this.startButton.textContent = "Start";
    this.startButton.style.cursor = "pointer";
  };

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

  animate = () => {
    TWEEN.update();
    this.renderer.render(this.scene, this.camera.camera);
    this.player.move(this.window_width, this.window_height);
    this.enemies.forEach((enemy) => enemy.checkIfHit(this.player.lasers));
    requestAnimationFrame(this.animate);
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

  startGame = () => {
    document.querySelector(".start-screen").style.display = "none";
    this.camera.startAnimation();
  };

  setupEventListeners = () => {
    window.addEventListener("resize", this.handleWindowResize);
    this.startButton.addEventListener("click", this.startGame);
  };

  calculateVisibleRegion = () => {
    const vFOV = THREE.MathUtils.degToRad(this.camera.camera.fov);
    this.window_height = 2 * Math.tan(vFOV / 2) * this.camera.height;
    this.window_width = this.camera.height * this.camera.camera.aspect;
  };
}

export default Game;
