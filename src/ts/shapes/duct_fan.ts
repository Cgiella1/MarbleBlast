import { ForceShape } from "./force_shape";
import { AudioSource, AudioManager } from "../audio";

/** Blows the marble away. */
export class DuctFan extends ForceShape {
	dtsPath = "shapes/hazards/ductfan.dts";
	sounds = ["fan_loop.wav"];
	soundSource: AudioSource;
	useInstancing = true;

	constructor() {
		super();

		this.addConicForce(10, 2.617, 40);
	}

	async onLevelStart() {
		this.soundSource = AudioManager.createAudioSource(this.sounds[0], AudioManager.soundGain, this.worldPosition);
		this.soundSource.setLoop(true);
		this.soundSource.play();
		await this.soundSource.promise;
	}
}