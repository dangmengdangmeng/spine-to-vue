import ModelBaseController from "./ModelBaseController"
import SkinController from "./SkinController"
import ModelService from "../services/model/ModelService";

class ModelController extends ModelBaseController {
    constructor() {
        super();
        this.skinController = new SkinController()
    }

    load(canvas, config = {}) {
        return new Promise(resolve => {
            this.skinController.files = config.files
            this.skinController.loadCallback = () => resolve()
            this.skinController.getJsonInfo(config.files['json']).then(() => {
                super.initParams(this.skinController, canvas)
            })
        })
    }

    getSkins() {
        return this.skinController.skins
    }

    fileToAnimation(json) {
        return new Promise(resolve => {
            ModelService.getJsonInfo(json).then(response => {
                const {animations} = response
                resolve(this.filterAnimations(animations))
            })
        })
    }

    filterAnimations(animations) {
        let items = []
        for (let key in animations) {
            items.push(key)
        }
        return items
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
