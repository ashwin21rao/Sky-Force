import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import Sprite from "./sprite.js";

class Player extends Sprite {
  constructor(scene, path) {
    super(scene, path);
    this.init();
    this.setUpMovement();
  }

  init = async () => {
    await this.loadSprite();

    console.log(this.sprite);
    this.sprite.position.set(0, 0, 0);
    this.sprite.rotation.set(0, -Math.PI / 2, 0);
    this.sprite.scale.set(0.4, 0.4, 0.4);
    this.sprite.translateX(8);
    this.scene.add(this.sprite);
  };

  setUpMovement = () => {
    window.addEventListener("keydown", (e) => {
      console.log("Here", e.key);
      if (e.key === "l") this.sprite.position.x += 1;
      else if (e.key === "j") this.sprite.position.x -= 1;
    });
  };
}

export default Player;
