import ModelBaseController from "./ModelBaseController"
import SkinController from "./SkinController"

class ModelController extends ModelBaseController {

    constructor() {
        super()
        this.isInit = false
        this.skinController = new SkinController()
    }

    load(canvas) {
        return new Promise(resolve => {
            if (this.isInit) resolve()
            this.isInit = true
            this.skinController.loadCallback = () => resolve()
            super.initParams(this.skinController, canvas)
        })
    }

    changeSkin(name) {
        this.skinController.changeSkin(name)
    }

    changeAction(name, isLoop = false, delay = 0) {
        this.skinController.changeAction(name, isLoop, delay)
    }
}

export default ModelController
