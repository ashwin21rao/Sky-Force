import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import Sprite from "./sprite.js";

class Player extends Sprite {
  constructor(scene, path) {
    super(scene, path);
    this.health = 15;
  }

  init = async (x_pos, y_pos) => {
    await this.loadSprite();

    console.log(this.sprite);
    this.sprite.position.set(x_pos, 0, y_pos);
    this.sprite.scale.set(0.5, 0.5, 0.5);
    this.sprite.rotation.set(0, Math.PI / 2, 0);

    this.scene.add(this.sprite);
  };

  checkIfHit = (lasers) => {
    lasers.forEach((laser) => {
      if (this.sprite.position.distanceTo(laser.position) <= 1) {
        console.log("Here");
        this.health -= 1;
      }
    });
    if (this.health == 0) this.scene.remove(this.sprite);
  };
}

export default Player;
