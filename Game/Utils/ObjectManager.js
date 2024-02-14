import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import GameObject from './GameObject';
import PlayerObject from '../Player/PlayerObject';
import resources from '../Resources/resources';
export default class ObjectManager {
  objects = [];
  #defaultObjectOptions = {
    mass: 0,
    size: [1, 1, 1],
    position: [0, 1, 0],
  };

  constructor(game) {
    this.game = game;
  }
  createPlayerObject(initPosition) {
    const model = resources.find((r) => r.name === 'playerModel').data;
    const body = new CANNON.Body({
      shape: this.game.physicsWorld.playerShape,
      material: this.game.physicsWorld.playerMaterial,
      mass: 10,
      fixedRotation: true,
      linearDamping: 0.1,
    });
    const mesh = model;
    mesh.scale.set(0.01, 0.01, 0.01);
    mesh.init;
    const animations = resources.filter((r) => r.type === 'playerAnimation');
    mesh.animations = animations;

    body.collisionFilterGroup = 2;
    body.position.copy(initPosition);
    const instance = new PlayerObject('player', mesh, body);
    this.game.objectManager.addObject(instance);

    return instance;
  }

  createObject(name, type, options = {}) {
    const combinedOptions = {
      name,
      type,
      ...this.#defaultObjectOptions,
      ...options,
    };
    switch (combinedOptions.type) {
      case 'box':
        this.#addBox(combinedOptions);
        break;
      case 'sphere':
        this.#addSphere(combinedOptions);
        break;
      case 'cylinder':
        this.#addCylinder(combinedOptions);
        break;
      default:
        throw new Error('Invalid geometry type');
    }
  }
  addObject(object) {
    this.#addBody(object.body);
    this.#addMesh(object.mesh);
    this.objects.push(object);
  }
  #addBox(options) {
    const mesh = new THREE.Mesh(
      this.game.world.boxGeometry,
      this.game.world.defaultMeshMaterial
    );
    mesh.scale.set(...options.size);
    const body = new CANNON.Body({
      mass: options.mass,
      material: this.game.physicsWorld.defaultMaterial,
      shape: new CANNON.Box(
        new CANNON.Vec3(
          options.size[0] * 0.5,
          options.size[1] * 0.5,
          options.size[2] * 0.5
        )
      ),
    });
    body.position.set(...options.position);
    mesh.position.set(...options.position);
    const object = new GameObject(options.name, mesh, body);
    this.addObject(object);
  }
  #addSphere(options) {}
  #addCylinder(options) {}

  destroy(name) {
    const obj = this.objects.find((o) => o.name === name);
    if (!obj) return;
    this.game.scene.remove(obj.mesh);
    this.game.physicsWorld.physicsWorld.removeBody(obj.body);
    this.objects.splice(this.objects.indexOf(obj), 1);
  }
  destroyAll() {}

  update() {
    this.objects.forEach((o) => o.update());
  }

  #addMesh(Object3D) {
    Object3D.traverse((c) => {
      if (c.type === 'Bone') return;
      c.castShadow = true;
    });
    this.game.scene.add(Object3D);
  }
  #addBody(body) {
    this.game.physicsWorld.physicsWorld.addBody(body);
  }
}
