class SkinController {
	constructor() {
		this.gl = null;
		this.renderer = null;
		this.offset = null;
		this.bounds = null;
		this.timeKeeper = null;
		this.DEMO_NAME = null;
		this.curSkin = ""; //当前皮肤名称
		this.skins = []; //皮肤列表
		this.curAction = ""; //当前动作名称
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
		this.currentRenderInfo = {
			width: null,
			height: null,
			x: 0,
			y: 0
		};
	}

	load(canvas, assetManager) {
		this.gl = canvas.ctx.gl;
		this.renderer = new spine.webgl.SceneRenderer(canvas, this.gl);
		let textureLoader = (img) => {
			return new spine.webgl.GLTexture(this.gl, img);
		};
		this.files.images.map((item) => {
			assetManager.loadTexture(this.DEMO_NAME, textureLoader, item.url);
		});
		assetManager.loadText(this.DEMO_NAME, this.files["atlas"]);
		assetManager.loadJson(this.DEMO_NAME, this.files["json"]);
		this.timeKeeper = new spine.TimeKeeper();
	}

	loadingComplete(assetManager) {
		const atlas = new spine.TextureAtlas(
			assetManager.get(this.DEMO_NAME, this.files["atlas"]),
			(path) => {
				return assetManager.get(this.DEMO_NAME, this.getFilePath(path));
			}
		);
		const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
		const skeletonJson = new spine.SkeletonJson(atlasLoader);
		const skeletonData = skeletonJson.readSkeletonData(
			assetManager.get(this.DEMO_NAME, this.files["json"])
		);
		this.skeleton = new spine.Skeleton(skeletonData);
		this.setDefaultRenderInfo();
		this.setSkinAndAnimaiton();
		this.changeSkin(this.curSkin);
		const stateData = new spine.AnimationStateData(this.skeleton.data);
		this.state = new spine.AnimationState(stateData);
		this.changeAction(this.curAction, true);
		this.state.apply(this.skeleton);
		this.skeleton.updateWorldTransform();
		this.offset = new spine.Vector2();
		this.bounds = new spine.Vector2();
		this.skeleton.getBounds(this.offset, this.bounds, []);
		if (this.loadCallback) {
			this.loadCallback();
		}
	}

	setSkinAndAnimaiton() {
		this.skins = this.skeleton.data.skins;
		this.curSkin = this.curSkin || this.skins[0].name || "";
		this.animations = [];
		this.skeleton.data.animations.map(item => this.animations.push(item.name));
		this.curAction = this.curAction || this.animations[0] || "";
	}

	getFilePath(name) {
		return this.files.images.find((item) => item.name === name).url;
	}

	setDefaultRenderInfo() {
		this.defaultRenderInfo = {
			width: this.skeleton.data.width * 2,
			height: this.skeleton.data.height * 2,
			x: 0,
			y: this.skeleton.data.height / 2
		};
		this.currentRenderInfo = JSON.parse(JSON.stringify(this.defaultRenderInfo));
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
		this.renderer.camera.position.x = this.currentRenderInfo.x || this.defaultRenderInfo.x;
		this.renderer.camera.position.y = this.currentRenderInfo.y || this.defaultRenderInfo.y;
		this.renderer.camera.viewportWidth = this.currentRenderInfo.width || this.defaultRenderInfo.width;
		this.renderer.camera.viewportHeight = this.currentRenderInfo.height || this.defaultRenderInfo.height;
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

	changeAction(name, isLoop = false) {
		this.curAction = name;
		if (this.state && this.animations.includes(this.curAction)) {
			this.state.setAnimation(0, this.curAction, isLoop);
		}
	}

	setSkin(skin) {
		// const slot = this.skeleton.findSlot("item_near");
		// const weapon = slot.getAttachment();
		this.skeleton.setSkin(skin);
		this.skeleton.setSlotsToSetupPose();
		// slot.setAttachment(weapon);
	}
}

export default SkinController;
