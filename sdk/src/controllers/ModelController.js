import BaseModelController from "./BaseModelController";
import GlobalData from "../Global";
import SkinController from "./SkinController";
import uuid from "uuid/v4";
import Helper from "../helper";

class ModelController {
	constructor() {
		this.config = {};
		this.isInit = false;
		this.randomId = uuid() + "_" + new Date().valueOf();
	}

	//todo 初始化
	init(config = {}) {
		return new Promise(resolve => {
			this.config = config;
			if (this.isInit) return false;
			this.isInit = true;
			GlobalData.models[this.randomId] = new SkinController();
			GlobalData.models[this.randomId]._name = this.randomId;
			GlobalData.models[this.randomId].files = this.config.files;

			GlobalData.baseModels[this.randomId] = new BaseModelController();
			GlobalData.baseModels[this.randomId].modelId = this.randomId;
			GlobalData.baseModels[this.randomId].init().then(() => {
				resolve();
			});
		});
	}

	//todo 加载模型
	load(canvas) {
		return new Promise((resolve, reject) => {
			if (!this.isInit) {
				reject('请先初始化');
			}
			GlobalData.baseModels[this.randomId].loadModel(canvas);
			GlobalData.models[this.randomId].loadCallback = () => resolve();
		});
	}

	//todo 获取所有皮肤
	getSkins() {
		return GlobalData.models[this.randomId].skins.map(item => {
			return item.name;
		});
	}

	//todo 切换皮肤
	changeSkin(name) {
		GlobalData.models[this.randomId].changeSkin(name);
	}

	//todo 返回当前使用的皮肤
	getCurSkin() {
		return GlobalData.models[this.randomId].curSkin;
	}

	//todo 创建一个空的皮肤
	createSkin(name = uuid()) {
		return new spine.Skin(name);
	}

	//todo 获取所有动画
	getAnimations() {
		return GlobalData.models[this.randomId].animations;
	}

	//todo 获取当前展示的动画
	getCurAnimation() {
		return GlobalData.models[this.randomId].curAnimation;
	}

	//todo 切换动画
	changeAnimation(name, isLoop = false) {
		GlobalData.models[this.randomId].changeAnimation(name, isLoop);
	}

	//todo 设置插槽内的内容
	setAttachments(skin, slotIndex, attachments) {
		for (let attachmentName in attachments) {
			skin.setAttachment(slotIndex, attachmentName, attachments[attachmentName]);
		}
		return skin;
	}

	//todo 根据名称获取相应皮肤
	getSkin(name) {
		return GlobalData.models[this.randomId].skins.find(item => item.name === name);
	}

	//todo 设置自定义皮肤到当前canvas
	setSkin(skin) {
		GlobalData.models[this.randomId].setSkin(skin);
	}

	//todo 获取模型中所有的插槽
	getSlots() {
		return GlobalData.models[this.randomId].skeleton.slots;
	}

	//todo 获取默认的模型大小
	getRenderInfo() {
		return Helper.deepCopy(GlobalData.models[this.randomId].defaultRenderInfo);
	}

	//todo 获取默认的模型大小
	setRenderInfo(info) {
		GlobalData.models[this.randomId].setCurrentRenderInfo(info);
	}
}

export default ModelController;
