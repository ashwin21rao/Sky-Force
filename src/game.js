import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js";
import Camera from "./camera.js";
import Player from "./player.js";

class Game {
  constructor() {
    this.container = document.querySelector(".container");
    this.scene = new THREE.Scene();
    this.camera = new Camera(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    this.ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(this.ambientLight);

    this.player = new Player(this.scene, "../assets/lancer-ii/Stingray.glb");
  }

  init = () => {
    this.initRenderer();
    this.loadScenebackground();
    this.setupEventListeners();
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
    this.camera.move();
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
  };

  startGame = () => {
    document.querySelector(".start-screen").style.display = "none";
    this.camera.startAnimation();
  };

  setupEventListeners = () => {
    window.addEventListener("resize", this.handleWindowResize);
    document
      .querySelector(".start-screen__start")
      .addEventListener("click", this.startGame);
  };
}

export default Game;
