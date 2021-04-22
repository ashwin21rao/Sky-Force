class Sprite {
  constructor(scene, model) {
    this.scene = scene;
    this.sprite = model.clone();
  }
}

export default Sprite;
