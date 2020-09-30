import { PowerUp } from "./power_up";
import { state } from "../state";
import * as THREE from "three";
import { Util } from "../util";
import OIMO from "../declarations/oimo";
import { AudioManager } from "../audio";

const particleOptions = {
	ejectionPeriod: 5,
	ambientVelocity: new THREE.Vector3(0, 0, 0.2),
	ejectionVelocity: 1 * 0.5,
	velocityVariance: 0.25 * 0.5,
	emitterLifetime: 1100,
	inheritedVelFactor: 0.25,
	particleOptions: {
		texture: 'particles/spark.png',
		blending: THREE.AdditiveBlending,
		spinSpeed: 0,
		spinRandomMin: 0,
		spinRandomMax: 0,
		lifetime: 1500,
		lifetimeVariance: 150,
		dragCoefficient: 0.25,
		acceleration: 0,
		colors: [{r: 0.8, g: 0.8, b: 0, a: 0}, {r: 0.8, g: 0.8, b: 0, a: 1}, {r: 0.8, g: 0.8, b: 0, a: 0}],
		sizes: [0.25, 0.25, 1],
		times: [0, 0.25, 1]
	}
};

export class SuperSpeed extends PowerUp {
	dtsPath = "shapes/items/superspeed.dts";
	pickUpName = "Super Speed PowerUp";
	sounds = ["pusuperspeedvoice.wav", "dosuperspeed.wav"];

	pickUp(): boolean {
		return state.currentLevel.pickUpPowerUp(this);
	}

	use() {
		let level = state.currentLevel;
		let marble = state.currentLevel.marble;
		let movementVector = new THREE.Vector3(1, 0, 0);
		movementVector.applyAxisAngle(new THREE.Vector3(0, 0, 1), level.yaw);

		let quat = level.newOrientationQuat;
		movementVector.applyQuaternion(quat);

		let quat2 = new OIMO.Quat();
		quat2.setArc(state.currentLevel.currentUp, marble.lastContactNormal);
		movementVector.applyQuaternion(new THREE.Quaternion(quat2.x, quat2.y, quat2.z, quat2.w));
		
		marble.body.addLinearVelocity(Util.vecThreeToOimo(movementVector).scale(24.7)); // Whirlgig's determined value

		AudioManager.play(this.sounds[1]);
		state.currentLevel.particles.createEmitter(particleOptions, null, () => Util.vecOimoToThree(marble.body.getPosition()));
	}
}