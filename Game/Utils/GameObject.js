import EventEmitter from '../EventEmitter';

export default class GameObject extends EventEmitter {
  constructor(name, mesh, body) {
    super();
    this.name = name;
    this.mesh = mesh;
    this.body = body;
  }
  update() {
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
  }
}
