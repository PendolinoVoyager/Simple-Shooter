import GameObject from '../Utils/GameObject';

export default class PlayerObject extends GameObject {
  constructor(name, mesh, body) {
    super(name, mesh, body);
  }
  update() {
    this.mesh.position.copy(this.body.position);
    this.mesh.position.y -= 0.9;
  }
}
