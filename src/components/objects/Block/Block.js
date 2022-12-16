// gravity is pretty much just a constant downward
// collisions with other boxes doesn't work, and the formula is also flawed
// at least the blocks don't go through the floor!

import * as THREE from 'three';

import BLOCK_TEXTURE from '../../textures/steel.jpg';
const BLOCK_MATERIAL = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load(BLOCK_TEXTURE),
});

const BLOCK_LENGTH = 3;
const BLOCK_HEIGHT = 0.5;
const BLOCK_WIDTH = 0.75;
const BLOCK_GEOMETRY = new THREE.BoxGeometry(
    BLOCK_LENGTH,
    BLOCK_HEIGHT,
    BLOCK_WIDTH
);

const EPS = 0.001;

const DAMPING = 0.03;
const GRAVITY = 9.8 * 10;

const G_ACCELERATION = new THREE.Vector3(0, -GRAVITY, 0);

export default class Block extends THREE.Mesh {
    constructor(groundY, position, yRotation = 0) {
        super(BLOCK_GEOMETRY, BLOCK_MATERIAL.clone());
        this.geometry.computeBoundingBox();

        this.groundY = groundY;

        this.position.copy(position);
        this.prevPosition = this.position.clone();

        this.rotation.y = yRotation;
    }

    applyGravity(dt) {
        const velocity = new THREE.Vector3().subVectors(
            this.position,
            this.prevPosition
        );
        this.prevPosition.copy(this.position);
        this.position
            .addScaledVector(velocity, (1 - DAMPING) * dt)
            .addScaledVector(G_ACCELERATION, dt * dt);

        const lowestY = this.groundY + BLOCK_HEIGHT / 2 + EPS;
        if (this.position.y < lowestY) {
            this.position.y = lowestY;
        }
    }

    /**
     * Handles collisions with another Block. Moves both Blocks equal distances
     * so that they are no longer colliding.
     */
    handleCollision(that) {
        const thisBox = this.geometry.boundingBox;
        const thatBox = that.geometry.boundingBox;

        if (!thisBox.intersectsBox(thatBox)) return;

        // Get the distances between their centers
        const center1 = new THREE.Vector3();
        this.geometry.boundingBox.getCenter(center1);
        this.localToWorld(center1);
        const center2 = new THREE.Vector3();
        that.geometry.boundingBox.getCenter(center2);
        that.localToWorld(center2);

        // const move = new THREE.Vector3()
        //     .subVectors(center1, center2)
        //     .divideScalar(2);
        // let groundY = this.position.y + .5 ;

        
        // if(that.position.y != this.position.y && that.position.y < groundY ){
        //         that.position.y = groundY;
        //  }

        // Move each box half of their distance away
        this.prevPosition.copy(this.position);
        that.prevPosition.copy(that.position);

        console.log(this.position); 

        let vAB = new THREE.Vector3();
        vAB.subVectors(center2, center1);
        let vabMag = vAB.length();

        if (vabMag < BLOCK_HEIGHT + EPS) {
            let vCorr = new THREE.Vector3();
            vCorr.add(vAB.divideScalar(vabMag).multiplyScalar(vabMag - BLOCK_HEIGHT - EPS));
            vCorr.divideScalar(2.0);
            this.position.add(vCorr);
            that.position.sub(vCorr);
          }
    }
}
 