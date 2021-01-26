import ModelBaseController from "./ModelBaseController"
import ModelService from "../services/model/ModelService"
import GlobalData from "../Global"
import SkinController from "./SkinController"
import * as uuid from 'uuid/v4'

class ModelController {
    constructor() {
        this.isInit = false
        this.randomId = uuid() + '_' + new Date().valueOf()
        GlobalData.models[this.randomId] = new SkinController()
    }

    load(canvas, config = {}) {
        return new Promise((resolve, reject) => {
            if (this.isInit) reject()
            this.isInit = true
            const modelBaseController = new ModelBaseController()
            modelBaseController.modelId = this.randomId
            GlobalData.models[this.randomId].DEMO_NAME = this.randomId
            GlobalData.models[this.randomId].files = config.files
            GlobalData.models[this.randomId].loadCallback = () => resolve()
            GlobalData.models[this.randomId].getJsonInfo(config.files['json']).then(() => {
                modelBaseController.initParams(canvas)
            })
        })
    }

    getSkins() {
        return GlobalData.models[this.randomId].skins
    }

    fileToAnimation(json) {
        return new Promise(resolve => {
            ModelService.getJsonInfo(json).then(response => {
                const {animations} = response
                resolve(this.filterAnimations(animations))
            })
        })
    }

    fileToSkin(json) {
        return new Promise(resolve => {
            ModelService.getJsonInfo(json).then(response => {
                const {skins} = response
                resolve(this.filterSkins(skins))
            })
        })
    }

    filterSkins(skins) {
        let items = []
        skins.map(item => {
            items.push(item.name)
        })
        return items
    }

    filterAnimations(animations) {
        let items = []
        for (let key in animations) {
            items.push(key)
        }
        return items
    }

    getAnimations() {
        return GlobalData.models[this.randomId].animations
    }

    changeSkin(name) {
        GlobalData.models[this.randomId].changeSkin(name)
    }

    changeAction(name, isLoop = false) {
        GlobalData.models[this.randomId].changeAction(name, isLoop)
    }
}

export default ModelController
