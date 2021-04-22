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

    this.scene.add(this.sprite);
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
    this.scene.remove(this.sprite);
  };
}

export default Enemy;
