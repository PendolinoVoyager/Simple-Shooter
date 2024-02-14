import * as CANNON from 'cannon-es';

export default class PhysicsWorld {
  mapElements = [];
  dt = 1 / 60;
  constructor(game) {
    this.game = game;
    this.physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.81, 0),
      allowSleep: true,
      broadphase: new CANNON.SAPBroadphase(),
    });
    this.#setDefaultContactMaterial();
    this.#setPlayerContactMaterial();
    this.#setPlayerShape();
    this.#setFloor();
    this.#addBoundary();
    this.#addDebug();
  }
  update() {
    this.physicsWorld.step(this.dt, this.game.globalClock.deltaTime * 0.001, 3);
  }

  #setDefaultContactMaterial() {
    this.defaultMaterial = new CANNON.Material('default', {
      restitution: 0.3,
      friction: 0.01,
    });
    this.defaultContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.3,
      }
    );
    this.physicsWorld.defaultContactMaterial = this.defaultContactMaterial;
  }
  #setPlayerContactMaterial() {
    this.playerMaterial = new CANNON.Material('player', {
      restitution: 1,
      friction: 0.1,
    });
    this.playerContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.playerMaterial,
      {
        friction: 0.006,
        restitution: 0.1,
      }
    );
    this.physicsWorld.addContactMaterial(this.playerContactMaterial);
  }
  #setPlayerShape() {
    this.playerShape = new CANNON.Cylinder(0.5, 0.5, 1.8);
  }
  #setFloor() {
    const floor = new CANNON.Plane();
    const slope = new CANNON.Plane();
    const body = new CANNON.Body({
      shape: floor,
      mass: 0,
      material: this.defaultMaterial,
      collisionFilterGroup: 4,
    });
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI * 0.5);
    this.floor = body;
    this.floor.position.y = 1;
    const copy = new CANNON.Body({
      shape: slope,
      mass: 0,
      material: this.defaultMaterial,
      collisionFilterGroup: 4,
    });
    copy.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI * 1.4);
    copy.position.z = 40;
    this.physicsWorld.addBody(body);
    this.physicsWorld.addBody(copy);
    this.mapElements.push(copy, floor);
  }
  #addDebug() {
    this.debugFolder = this.game.debugGUI.gui.addFolder('Physics');
    this.debugFolder
      .add(this.defaultContactMaterial, 'friction', 0, 1)
      .name('Object friction');
    this.debugFolder
      .add(this.defaultContactMaterial, 'restitution', 0, 1)
      .name('Object restitution');
    this.debugFolder
      .add(this.playerContactMaterial, 'friction', 0, 1)
      .name('Player friction');
    this.debugFolder
      .add(this.playerContactMaterial, 'restitution', 0, 1)
      .name('Player restitution');
    this.debugFolder
      .add(this.physicsWorld.gravity, 'x', -50, 50)
      .name('Gravity x');
    this.debugFolder
      .add(this.physicsWorld.gravity, 'y', -50, 50)
      .name('Gravity y');
    this.debugFolder
      .add(this.physicsWorld.gravity, 'z', -50, 50)
      .name('Gravity z');
  }
  #addBoundary() {
    const plane = new CANNON.Plane();
    const boundary = new CANNON.Body({ material: this.defaultMaterial });
    boundary.addShape(plane);
    boundary.addShape(
      plane,
      new CANNON.Vec3(0, 0, 0),
      new CANNON.Quaternion().setFromAxisAngle(
        new CANNON.Vec3(0, 1, 0),
        Math.PI * 0.5
      )
    );

    this.physicsWorld.addBody(boundary);
  }
}
