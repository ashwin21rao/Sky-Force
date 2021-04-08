import { GLTFLoader } from "https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js";

class Sprite {
  constructor(scene, path) {
    this.path = path;
    this.scene = scene;
    this.sprite = null;
  }

  loadSprite = () => {
    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
      loader.load(
        this.path,
        (gltf) => {
          this.sprite = gltf.scene;
          resolve(gltf);
        },
        undefined,
        (err) => console.log(err)
      );
    });
  };
}

export default Sprite;
