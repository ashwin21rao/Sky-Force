import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";

class Sprite {
  constructor(scene, model) {
    this.scene = scene;
    this.sprite = model.clone();
    this.bbox = new THREE.Box3().setFromObject(this.sprite);
  }

  checkCollision = (gameObject) => {
    this.sprite.updateMatrixWorld();
    gameObject.sprite.updateMatrixWorld();

    const box1 = this.bbox.clone();
    box1.applyMatrix4(this.sprite.matrixWorld);

    const box2 = gameObject.bbox.clone();
    box2.applyMatrix4(gameObject.sprite.matrixWorld);

    return box1.intersectsBox(box2);
  };

  checkLaserCollision = (laser) => {
    this.sprite.updateMatrixWorld();
    laser.updateMatrixWorld();

    const box1 = this.bbox.clone();
    box1.applyMatrix4(this.sprite.matrixWorld);

    const box2 = laser.geometry.boundingBox.clone();
    box2.applyMatrix4(laser.matrixWorld);

    return box1.intersectsBox(box2);
  };
}

export default Sprite;
