import TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js";
import ShootingEnemy from "./shootingEnemy.js";

class BossEnemy {
  constructor(scene, model, difficulty) {
    this.scene = scene;
    this.model = model;
    this.difficulty = difficulty;
    this.health = 25;

    this.on_screen = false;
  }

  init = (window_width, window_height) => {
    const number_of_enemies = Math.floor((20 / 100) * window_width);
    this.enemies = Array.from(
      { length: number_of_enemies },
      () => new ShootingEnemy(this.scene, this.model, this.health)
    );

    const width = window_width - 30;
    for (const [i, enemy] of this.enemies.entries()) {
      enemy.init(
        (width * i) / number_of_enemies - width / 2,
        -window_height / 2 - 3
      );
    }
    this.final_y_pos = -window_height / 2 + 4;
  };

  shoot = ({ player_x, player_y }) => {
    this.enemies.forEach((enemy) =>
      enemy.shoot({
        player_x,
        player_y,
        probability: 1 - this.difficulty * 0.05,
      })
    );
  };

  checkIfHitPlayer = (player) => {
    this.enemies.forEach((enemy) => {
      enemy.lasers = player.checkIfHit(enemy.lasers);
    });
  };

  checkIfHit = (player) => {
    // check if hit only once boss enemy is on the screen
    if (!this.on_screen) return;

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

  animateIn = () => {
    this.enemies.forEach((enemy) => {
      const position = {
        z: enemy.sprite.position.z,
      };
      new TWEEN.Tween(position)
        .to({ z: this.final_y_pos }, 1500)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(() => {
          enemy.sprite.position.z = position.z;
        })
        .delay(20000)
        .start()
        .onComplete(() => (this.on_screen = true));
    });
  };
}

export default BossEnemy;
