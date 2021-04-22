import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import Enemy from "./enemy.js";

class ShootingEnemy extends Enemy {
  constructor(scene, model) {
    super(scene, model);
    this.lasers = [];
  }

  shoot = ({ player_x, player_y }) => {
    if (
      Math.abs(this.sprite.position.x - player_x) <= 2 ||
      Math.random() > 0.9
    ) {
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const laser = new THREE.Mesh(geometry, material);

      laser.geometry.computeBoundingBox();

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

  remove = () => {
    this.lasers.forEach((laser) => this.scene.remove(laser));
    this.scene.remove(this.sprite);
  };
}

export default ShootingEnemy;
