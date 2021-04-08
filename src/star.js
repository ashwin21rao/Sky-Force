import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";

class Star {
  constructor(scene) {
    this.scene = scene;
    this.path = "../assets/star.png";
    this.sprite = null;
    this.loadSprite();
  }

  loadSprite = () => {
    const map = new THREE.TextureLoader().load(this.path);
    const material = new THREE.SpriteMaterial({
      map: map,
      color: 0xffffff,
    });
    this.sprite = new THREE.Sprite(material);
    this.scene.add(this.sprite);
  };

  remove = () => {
    this.scene.remove(this.sprite);
  };
}

export default Star;
