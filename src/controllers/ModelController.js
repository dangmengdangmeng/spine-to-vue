import ModelBaseController from "./ModelBaseController"
import SkinController from "./SkinController"
import GlobalData from "../Global"

class ModelController {

    constructor() {
        this.isInit = false
        GlobalData.demo = new SkinController()
        this.modelBaseController = new ModelBaseController()
    }

    load(canvas, config = {}) {
        return new Promise(resolve => {
            if (this.isInit) resolve()
            this.isInit = true
            GlobalData.demo.files = config.files
            GlobalData.demo.loadCallback = () => resolve()
            GlobalData.demo.getJsonInfo(config.files['json']).then(() => {
                this.modelBaseController.initParams(canvas)
            })
        })
    }

    getSkins() {
        return GlobalData.demo.skins
    }

    getAnimations() {
        return GlobalData.demo.animations
    }

    changeSkin(name) {
        GlobalData.demo.changeSkin(name)
    }

    changeAction(name, isLoop = false, delay = 0) {
        GlobalData.demo.changeAction(name, isLoop, delay)
    }
}

export default ModelController
