import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js";
import Game from "./game.js";

// let container;
// let scene, camera, renderer, sprite;

// const init = () => {
//   container = document.querySelector(".container");

//   // scene
//   scene = new THREE.Scene();

//   // camera
//   camera = new THREE.PerspectiveCamera(
//     45,
//     container.clientWidth / container.clientHeight,
//     0.1,
//     1000
//   );
//   camera.position.set(0, 10, 10);
//   camera.lookAt(0, 0, 0);

//   // lighting
//   const ambient = new THREE.AmbientLight(0xffffff, 8);
//   scene.add(ambient);

//   const light = new THREE.DirectionalLight(0xffffff, 1);
//   light.position.set(10, 10, 10);
//   scene.add(light);

//   // renderer
//   renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//   renderer.setSize(container.clientWidth, container.clientHeight);
//   renderer.setPixelRatio(window.devicePixelRatio);
//   container.appendChild(renderer.domElement);
// };

// const loadModel = (path) => {
//   const loader = new GLTFLoader();
//   loader.load(
//     path,
//     (gltf) => {
//       sprite = gltf.scene.children[0];
//       scene.add(gltf.scene);
//       animate();
//     },
//     undefined,
//     (err) => console.log(err)
//   );
// };

// const animate = () => {
//   requestAnimationFrame(animate);
//   sprite.rotation.z += 0.01;
//   renderer.render(scene, camera);
// };

// const main = () => {
//   init();
//   loadModel("../assets/aircraft/scene.gltf");
// };

// main();

const game = new Game();
game.init();
game.animate();
