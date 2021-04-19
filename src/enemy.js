import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import Sprite from "./sprite.js";

class Enemy extends Sprite {
  constructor(scene, path) {
    super(scene, path);
    this.health = 20;
    this.lasers = [];
    this.dead = false;
  }

  init = async (x_pos, y_pos) => {
    await this.loadSprite();

    this.sprite.position.set(x_pos, 0, y_pos);
    this.sprite.scale.set(0.12, 0.12, 0.12);
    // this.sprite.rotation.set(0, Math.PI / 2, 0);

    this.scene.add(this.sprite);
  };

  shoot = ({ player_x, player_y }) => {
    if (
      Math.abs(this.sprite.position.x - player_x) <= 2 ||
      Math.random() > 0.9
    ) {
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const laser = new THREE.Mesh(geometry, material);

      this.lasers.push(laser);
      laser.scale.set(0.2, 0.2, 1);
      laser.position.set(
        this.sprite.position.x,
        this.sprite.position.y,
        this.sprite.position.z
      );
      this.scene.add(laser);
    }
  };

  moveLasers = (height) => {
    if (this.dead) {
      this.lasers.forEach((laser) => this.scene.remove(laser));
      return;
    }

    this.lasers = this.lasers.filter((laser) => {
      laser.position.z += 1;
      const ret = laser.position.z > height / 2;
      if (ret) this.scene.remove(laser);
      return !ret;
    });
  };

  checkIfHit = (lasers) => {
    lasers = lasers.filter((laser) => {
      const ret = this.sprite.position.distanceTo(laser.position);
      if (ret <= 1) {
        this.scene.remove(laser);
        this.health -= 1;
      }
      return ret > 1;
    });

    if (this.health == 0) {
      this.dead = true;
      this.scene.remove(this.sprite);
    }
    return [lasers, this.dead];
  };

  remove = () => {
    this.lasers.forEach((laser) => this.scene.remove(laser));
    this.scene.remove(this.sprite);
  };
}

export default Enemy;
