export default class CameraControls {
  #cursor = { x: 0, y: 0 };
  sensitivity = 0.05;
  distance = 3;
  orbitAngle = 0;
  upDownAngle = 0;
  constructor(canvas, camera) {
    this.camera = camera;
    this.canvas = canvas;
    this.#hijackCursor();
    this.#trackMouse();
  }
  follow(target) {
    this.target = target;
    this.camera.position.copy(this.target.state.position);
    return this;
  }
  update() {
    this.orbitAngle -= this.#cursor.x * this.sensitivity;
    this.upDownAngle += this.#cursor.y * this.sensitivity;
    this.upDownAngle = Math.max(Math.min(this.upDownAngle, Math.PI * 0.5), 0);

    const offsetX =
      this.distance * Math.sin(this.orbitAngle) * Math.cos(this.upDownAngle);
    const offsetZ =
      this.distance * Math.cos(this.orbitAngle) * Math.cos(this.upDownAngle);
    const offsetY = this.distance * Math.sin(this.upDownAngle);
    const { x, y, z } = this.target.instance.mesh.position;
    this.camera.position.x = this.target.state.position.x + -offsetX;
    this.camera.position.y = this.target.state.position.y + offsetY;
    this.camera.position.z = this.target.state.position.z - offsetZ;
    this.camera.lookAt(x, y + 1, z);
    this.#cursor.x = this.#cursor.y = 0;
  }

  #trackMouse() {
    this.canvas.addEventListener('mousemove', (e) => {
      this.#cursor.x = e.movementX * this.sensitivity;
      this.#cursor.y = e.movementY * this.sensitivity;
    });
  }
  #hijackCursor() {
    this.canvas.addEventListener('click', async () => {
      await this.canvas.requestPointerLock();
      await this.canvas.requestFullscreen();
    });
  }
}
