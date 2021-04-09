import Helper from "../helper";

class SkinController {
	constructor() {
		this.gl = null;
		this.renderer = null;
		this.offset = null;
		this.bounds = null;
		this.timeKeeper = null;
		this._name = null;
		this.curSkin = ""; //当前皮肤名称
		this.skins = []; //皮肤列表
		this.curAnimation = ""; //当前动作名称
		this.animations = []; //动作列表
		this.skeleton = null;
		this.files = []; //当前文件列表
		this.state = null;
		this.loadCallback = null;
		this.defaultRenderInfo = {
			width: null,
			height: null,
			x: 0,
			y: 0
		};
		this.currentRenderInfo = {};
	}

	init(assetManager) {
		return new Promise(resolve => {
			let textureLoader = img => {
				return new spine.webgl.GLTexture(this.gl, img);
			};
			this.files.images.map((item) => {
				assetManager.loadTexture(this._name, textureLoader, item.url);
			});
			assetManager.loadText(this._name, this.files["atlas"]);
			assetManager.loadJson(this._name, this.files["json"], info => {
				this.skins = info.skins;
				this.animations = Object.keys(info.animations);
				resolve();
			});
			this.timeKeeper = new spine.TimeKeeper();
		});
	}

	load(canvas) {
		this.gl = canvas.ctx.gl;
		this.renderer = new spine.webgl.SceneRenderer(canvas, this.gl);
	}

	loadingComplete(assetManager) {
		const atlas = new spine.TextureAtlas(
			assetManager.get(this._name, this.files["atlas"]),
			(path) => {
				return assetManager.get(this._name, this.getFilePath(path));
			}
		);
		const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
		const skeletonJson = new spine.SkeletonJson(atlasLoader);
		const skeletonData = skeletonJson.readSkeletonData(
			assetManager.get(this._name, this.files["json"])
		);
		this.skeleton = new spine.Skeleton(skeletonData);
		const stateData = new spine.AnimationStateData(this.skeleton.data);
		this.state = new spine.AnimationState(stateData);
		this.state.apply(this.skeleton);
		this.skeleton.updateWorldTransform();
		this.offset = new spine.Vector2();
		this.bounds = new spine.Vector2();
		this.skeleton.getBounds(this.offset, this.bounds, []);
		this.setDefaultRenderInfo();
		this.setSkinAndAnimation();
		this.changeSkin(this.curSkin);
		this.changeAnimation(this.curAnimation, true);
		if (this.loadCallback) {
			this.loadCallback();
		}
	}

	setSkinAndAnimation() {
		this.skins = this.skeleton.data.skins;
		this.curSkin = this.curSkin || this.skins[0].name || "";
		this.animations = [];
		this.skeleton.data.animations.map(item => this.animations.push(item.name));
		this.curAnimation = this.curAnimation || this.animations[0] || "";
	}

	getFilePath(name) {
		return this.files.images.find((item) => item.name === name).url;
	}

	setDefaultRenderInfo() {
		//todo 不同角色的初始y不同 需要先把所有角色的y轴归0 然后去计算角色的中心位置
		const _offsetY = 0 - this.skeleton.data.y;
		this.defaultRenderInfo = {
			width: this.skeleton.data.width * 2,
			height: this.skeleton.data.height * 2,
			x: 0,
			y: -_offsetY + this.skeleton.data.height / 2
		};
		this.currentRenderInfo = Helper.deepCopy(this.defaultRenderInfo);
	}

	setCurrentRenderInfo(info) {
		if (!info) {
			return false;
		}
		this.currentRenderInfo = info;
	}

	render() {
		this.timeKeeper.update();
		const {delta} = this.timeKeeper;
		this.renderer.camera.position.x = this.currentRenderInfo.x;
		this.renderer.camera.position.y = this.currentRenderInfo.y;
		this.renderer.camera.viewportWidth = this.currentRenderInfo.width;
		this.renderer.camera.viewportHeight = this.currentRenderInfo.height;
		this.renderer.resize(spine.webgl.ResizeMode.Fit);

		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this.state.update(delta);
		this.state.apply(this.skeleton);
		this.skeleton.updateWorldTransform();

		this.renderer.begin();
		this.renderer.drawSkeleton(this.skeleton, true);
		this.renderer.end();
	}

	changeSkin(name) {
		this.curSkin = name;
		if (this.skeleton && this.skins.some(item => item.name === this.curSkin)) {
			this.skeleton.setSkinByName(this.curSkin);
			this.skeleton.setSlotsToSetupPose();
		}
	}

	changeAnimation(name, isLoop = false) {
		this.curAnimation = name;
		if (this.state && this.animations.includes(this.curAnimation)) {
			this.state.setAnimation(0, this.curAnimation, isLoop);
		}
	}

	setSkin(skin) {
		this.skeleton.setSkin(skin);
		this.skeleton.setSlotsToSetupPose();
	}
}

export default SkinController;
