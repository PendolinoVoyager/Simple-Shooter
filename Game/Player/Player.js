import { Quaternion, Raycaster, Vector3, AnimationMixer } from 'three';
import { Vec3 } from 'cannon-es';

import PlayerControls from './PlayerControls';

export default class Player {
  speed = 30;
  jumpHeight = 5;
  midAirPenalty = 0.1;
  maxSpeed = 5;
  state = {
    position: { x: 5, y: 3, z: 5 },
    rotation: { rightLeft: 0, upDown: 0 },
    midAir: false,
    shoot: false,
    keys: {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
    },
  };
  animations = {
    clipActions: [],
  };

  constructor(game, main, id) {
    this.state.id = id ?? Date.now();
    this.game = game;
    if (main) {
      this.controls = new PlayerControls(this.game, this);
    }
    this.instance = this.game.objectManager.createPlayerObject(
      this.state.position
    );
    this.state.position = this.instance.body.position;
    this.jumpRaycaster = new Raycaster();
    this.jumpRaycaster.near = 0.87;
    this.jumpRaycaster.far = 1.1;

    this.animationMixer = new AnimationMixer(this.instance.mesh);

    this.instance.mesh.animations.forEach((a) => {
      a.data.rotation.set(Math.PI * 0.5, 0, Math.PI * 0.5);
      this.animations.clipActions.push({
        name: a.name,
        action: this.animationMixer.clipAction(a.data.animations[0]),
      });
      this.#filterPositionTracks();
    });
    this.#addDebug();
  }
  #filterPositionTracks() {
    this.animations.clipActions.forEach((ca) => {
      ca.action._clip.tracks.forEach((t) => {
        if (t.name.includes('.position')) {
          t = undefined;
        }
      });
    });
  }
  update() {
    this.controls.update();
    this.state.rotation.upDown = this.game.cameraControls.upDownAngle;
    const totalMovement = this.#getMovementVector();

    if (totalMovement.length() !== 0) this.#rotateMesh(totalMovement);

    const currentSpeed = this.instance.body.velocity.length();
    if (currentSpeed > this.maxSpeed) {
      totalMovement.multiplyScalar(0.1);
    }
    const speedMultiplier = this.state.midAir ? this.midAirPenalty : 1;
    this.instance.body.applyLocalImpulse(
      totalMovement.multiplyScalar(speedMultiplier * this.speed),
      new Vec3(0, 0, 0)
    );

    // Jumping
    if (this.state.keys.jump && !this.state.midAir) {
      this.state.action = 'jump';
      this.instance.body.applyLocalImpulse(new Vector3(0, this.jumpHeight, 0));
    }
    this.#updateAnimations();
  }
  slowUpdate() {
    this.#checkMidair();
  }
  #addDebug() {
    this.debugFolder = this.game.debugGUI.gui.addFolder('Player');
    this.debugFolder.add(this, 'speed', 30, 10000);
    this.debugFolder.add(this, 'maxSpeed', 0, 100);
    this.debugFolder.add(this, 'jumpHeight', 1, 10);
    this.debugFolder.add(this, 'midAirPenalty', 0, 1);
    this.animations.clipActions.forEach((a, i) => {
      this.debugFolder.add(a.action, 'play').name(a.name);
    });
  }
  #rotateMesh(totalMovement) {
    const quaternion = new Quaternion();
    const angle = Math.atan2(-totalMovement.z, totalMovement.x);
    quaternion.setFromAxisAngle(new Vector3(0, 1, 0), angle + Math.PI * 0.5);

    this.instance.mesh.quaternion.rotateTowards(quaternion, 0.1);
    this.state.rotation.rightLeft = quaternion;
  }
  /**
   *  Gets a normalized movement direction in xz plane.
   * @returns Vector3
   */
  #getMovementVector() {
    const cameraNormal = this.getCameraNormal();

    // Calculate movement direction based on camera normal vector
    const moveDirection = new Vector3(
      cameraNormal.x, // Use camera's x-component as movement direction along the x-axis
      0, // No movement on the y-axis for typical 3rd person movement
      cameraNormal.z // Use camera's z-component as movement direction along the z-axis
    )
      .normalize()
      .multiplyScalar(this.state.keys.up - this.state.keys.down);

    // Calculate strafing direction perpendicular to movement direction
    const strafeDirection = new Vector3(
      -cameraNormal.z, // Perpendicular direction to camera's z-component for strafing along x-axis
      0,
      cameraNormal.x // Perpendicular direction to camera's x-component for strafing along z-axis
    )
      .normalize()
      .multiplyScalar(this.state.keys.right - this.state.keys.left);
    // Apply movement
    return moveDirection.add(strafeDirection).normalize();
  }
  getCameraNormal() {
    const cameraNormal = new Vector3();
    return this.game.camera.instance.getWorldDirection(cameraNormal);
  }
  #checkMidair() {
    this.jumpRaycaster.set(this.state.position, new Vector3(0, -1, 0));
    const intersect = this.jumpRaycaster.intersectObjects(
      [
        this.game.world.map.gameMap,
        ...this.game.objectManager.objects.map((o) => o.mesh),
      ],

      true
    );
    this.state.midAir = !Boolean(intersect.length);
  }
  #updateAnimations() {
    this.animationMixer.update(this.game.globalClock.deltaTime * 0.001);
  }
  updateFromState() {
    this.instance.body.position.set(...Object.values(this.state.position));
    this.instance.mesh.position.set(...Object.values(this.state.position));
  }
}
