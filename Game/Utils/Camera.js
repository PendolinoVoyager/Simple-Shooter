import { PerspectiveCamera } from 'three';
export default class Camera {
  constructor(game) {
    this.game = game;
    this.instance = new PerspectiveCamera(75, this.game.sizes.aspect, 0.1, 500);
    this.instance.position.set(0.5, 0.5, 2);
    this.game.scene.add(this.instance);
  }
}
