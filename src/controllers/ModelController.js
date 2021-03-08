import ModelBaseController from "./ModelBaseController";
import GlobalData from "../Global";
import SkinController from "./SkinController";
import * as uuid from "uuid/v4";

class ModelController {
	constructor() {
		this.isInit = false;
		this.randomId = uuid() + "_" + new Date().valueOf();
		GlobalData.models[this.randomId] = new SkinController();
	}

	load(canvas, config = {}) {
		return new Promise((resolve, reject) => {
			if (this.isInit) reject();
			this.isInit = true;
			const modelBaseController = new ModelBaseController();
			modelBaseController.modelId = this.randomId;
			GlobalData.models[this.randomId].DEMO_NAME = this.randomId;
			GlobalData.models[this.randomId].files = config.files;
			GlobalData.models[this.randomId].loadCallback = () => resolve();
			modelBaseController.initParams(canvas);
		});
	}

	getSkins() {
		let items = GlobalData.models[this.randomId].skins.map(item => {
			return item.name;
		});
		return items;
	}

	getAnimations() {
		return GlobalData.models[this.randomId].animations;
	}

	changeSkin(name) {
		GlobalData.models[this.randomId].changeSkin(name);
	}

	changeAction(name, isLoop = false) {
		GlobalData.models[this.randomId].changeAction(name, isLoop);
	}

	//创建一个空的皮肤
	createSkin(name) {
		if (!name) throw new Error('name is undefined');
		return new spine.Skin(name);
	}

	//设置插槽内的内容
	setAttachments(skin, slotIndex, attachments) {
		for (var attachmentName in attachments) {
			skin.setAttachment(slotIndex, attachmentName, attachments[attachmentName]);
		}
		return skin;
	}

	//根据名称获取相应皮肤
	getSkin(name) {
		return GlobalData.models[this.randomId].skins.find(item => item.name === name);
	}

	//设置自定义皮肤到当前canvas
	setSkin(skin) {
		GlobalData.models[this.randomId].setSkin(skin);
	}

	//获取模型中所有的插槽
	getSlots() {
		return GlobalData.models[this.randomId].skeleton.slots;
	}

	getDefaultRenderInfo() {
		return JSON.parse(JSON.stringify(GlobalData.models[this.randomId].defaultRenderInfo));
	}

	setCurrentRenderInfo(info) {
		GlobalData.models[this.randomId].setCurrentRenderInfo(info);
	}
}

export default ModelController;
