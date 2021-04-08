import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import Sprite from "./sprite.js";

class Player extends Sprite {
  constructor(scene, path) {
    super(scene, path);
    this.setUpEventListeners();
    this.movements = { left: false, right: false, up: false, down: false };
    this.lasers = [];
    this.score = 0;
    this.health = 10;
    this.dead = false;
  }

  init = async () => {
    await this.loadSprite();

    console.log(this.sprite);
    this.sprite.position.set(0, 0, 0);
    this.sprite.rotation.set(0, -Math.PI / 2, 0);
    this.sprite.scale.set(0.3, 0.3, 0.3);
    this.sprite.translateX(15);
    this.scene.add(this.sprite);
  };

  onKeyDown = (e) => {
    // movement
    if (e.key === "d") this.movements.right = true;
    else if (e.key === "a") this.movements.left = true;
    else if (e.key === "w") this.movements.up = true;
    else if (e.key === "s") this.movements.down = true;

    // shoot laser
    if (e.key === " ") this.shoot();
  };

  onKeyUp = (e) => {
    if (e.key === "d") this.movements.right = false;
    else if (e.key === "a") this.movements.left = false;
    else if (e.key === "w") this.movements.up = false;
    else if (e.key === "s") this.movements.down = false;
  };

  move = (width, height) => {
    if (this.movements.right && this.sprite.position.x < width / 2 - 15)
      this.sprite.position.x += 0.4;
    if (this.movements.left && this.sprite.position.x > -width / 2 + 15)
      this.sprite.position.x -= 0.4;
    if (this.movements.up && this.sprite.position.z > -height / 2 + 5)
      this.sprite.position.z -= 0.4;
    if (this.movements.down && this.sprite.position.z < height / 2 - 5)
      this.sprite.position.z += 0.4;
  };

  shoot = () => {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const new_lasers = [
      new THREE.Mesh(geometry, material),
      new THREE.Mesh(geometry, material),
    ];

    new_lasers.forEach((laser, i) => {
      this.lasers.push(laser);
      laser.scale.set(0.2, 0.2, 1.5);
      laser.position.set(
        this.sprite.position.x + 1.7 * (i === 0 ? 1 : -1),
        this.sprite.position.y,
        this.sprite.position.z
      );
      this.scene.add(laser);
    });
  };

  moveLasers = (height) => {
    this.lasers = this.lasers.filter((laser) => {
      laser.position.z -= 1;
      const ret = laser.position.z < -height / 2;
      if (ret) this.scene.remove(laser);
      return !ret;
    });
  };

  checkIfHit = (lasers) => {
    lasers = lasers.filter((laser) => {
      const ret = this.sprite.position.distanceTo(laser.position);
      if (ret <= 2) {
        this.scene.remove(laser);
        this.health -= 1;
      }
      return ret > 2;
    });

    if (this.health <= 0) {
      this.scene.remove(this.sprite);
      this.dead = true;
    }
    return lasers;
  };

  checkIfStarObtained = (stars) => {
    return stars.filter((star) => {
      const ret = this.sprite.position.distanceTo(star.sprite.position);
      if (ret <= 3) {
        this.scene.remove(star.sprite);
        this.score += 5;
        this.health += 0.2;
      }
      return ret > 3;
    });
  };

  remove = () => {
    this.lasers.forEach((laser) => this.scene.remove(laser));
    this.scene.remove(this.sprite);

    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  };

  setUpEventListeners = () => {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  };
}

export default Player;
