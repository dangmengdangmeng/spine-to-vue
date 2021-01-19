import ModelBaseController from "./ModelBaseController"
import SkinController from "./SkinController"
import ModelService from "spine-to-vue/src/services/model/ModelService"

class ModelController extends ModelBaseController {

    constructor() {
        super()
        this.isInit = false
        this.skinController = new SkinController()
        this.skins = []
        this.animations = []
    }

    load(canvas, config = {}) {
        return new Promise(resolve => {
            if (this.isInit) resolve()
            this.isInit = true
            this.skinController.files = config.files
            this.skinController.loadCallback = () => resolve()
            super.initParams(this.skinController, canvas)
        })
    }

    getSkins() {
        return this.skinController.skins
    }

    getAnimations() {
        return this.skinController.animations
    }

    changeSkin(name) {
        this.skinController.changeSkin(name)
    }

    changeAction(name, isLoop = false, delay = 0) {
        this.skinController.changeAction(name, isLoop, delay)
    }
}

export default ModelController
