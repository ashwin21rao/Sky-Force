import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import TWEEN from "https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js";

class Camera {
  constructor(window_width, window_height) {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window_width / window_height,
      0.1,
      1000
    );

    this.camera.position.set(0, 30, 0);
    this.camera.lookAt(0, 60, 0);
    this.can_move = false;
  }

  resetAspectRatio = (window_width, window_height) => {
    this.camera.aspect = window_width / window_height;
    this.camera.updateProjectionMatrix();
  };

  startAnimation = () => {
    const startRotation = this.camera.quaternion.clone();

    this.camera.lookAt(0, 0, 0);
    const endRotation = this.camera.quaternion.clone();

    this.camera.quaternion.copy(startRotation);

    new TWEEN.Tween(this.camera.quaternion)
      .to(endRotation, 2000)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start()
      .onComplete(() => {
        const position = {
          x: this.camera.position.x,
          y: this.camera.position.y,
          z: this.camera.position.z,
        };

        console.log("Here", position);
        new TWEEN.Tween(position)
          .to({ x: 0, y: 30, z: 20 }, 2000)
          .easing(TWEEN.Easing.Linear.None)
          .onUpdate(() => {
            this.camera.position.set(position.x, position.y, position.z);
            this.camera.lookAt(0, 0, 0);
          })
          .delay(200)
          .start()
          .onComplete(() => (this.can_move = true));
      });
  };

  move = () => {};
}

export default Camera;
