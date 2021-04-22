import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import ShootingEnemy from "./shootingEnemy.js";

class BossEnemy {
  constructor(scene, path) {
    this.scene = scene;
    this.path = path;
  }

  init = async (window_width, window_height) => {
    const number_of_enemies = Math.floor((20 / 100) * window_width);
    this.enemies = Array.from(
      { length: number_of_enemies },
      () => new ShootingEnemy(this.scene, this.path)
    );

    const width = window_width - 30;
    for (const [i, enemy] of this.enemies.entries()) {
      await enemy.init(
        (width * i) / number_of_enemies - width / 2,
        -window_height / 2 + 4
      );
    }
  };

  shoot = ({ player_x, player_y }) => {
    this.enemies.forEach((enemy) =>
      enemy.shoot({
        player_x,
        player_y,
      })
    );
  };

  checkIfHitPlayer = (player) => {
    this.enemies.forEach((enemy) => {
      enemy.lasers = player.checkIfHit(enemy.lasers);
    });
  };

  checkIfHit = (player) => {
    this.enemies.forEach((enemy) => {
      let dead;
      [player.lasers, dead] = enemy.checkIfHit(player.lasers);
      if (dead) player.score += 10;
    });
  };

  moveLasers = () => {
    this.enemies.forEach((enemy) => {
      enemy.moveLasers();
    });
  };

  killDead = () => {
    this.enemies = this.enemies.filter((enemy) => !enemy.dead);
  };

  isDead = () => {
    return this.enemies.length === 0;
  };

  remove = () => {
    this.enemies.forEach((enemy) => enemy.remove());
  };
}

export default BossEnemy;
