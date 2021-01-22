import * as uuid from 'uuid/v4'
import GlobalData from "spine-to-vue/src/Global"

class ModelBaseController {
    constructor() {
        this.spineDemos = {
            assetManager: new spine.SharedAssetManager(''),
        }
        this.modelId = null
        this.fps = 20
        this.loopTimer = null

    }

    initParams(placeholder) {
        const canvas = this.createCanvases()
        const {assetManager} = this.spineDemos
        GlobalData.models[this.modelId].load(canvas, assetManager)
        GlobalData.models[this.modelId].placeholder = placeholder
        GlobalData.models[this.modelId].canvas = canvas
        GlobalData.models[this.modelId].visible = false
        this.loop()
    }

    renderDemo() {
        const {canvas = {}, visible, placeholder, DEMO_NAME} = GlobalData.models[this.modelId]
        const {assetManager} = this.spineDemos
        if (assetManager.isLoadingComplete(DEMO_NAME)) {
            if (!GlobalData.models[this.modelId].loaded) {
                GlobalData.models[this.modelId].loadingComplete(assetManager)
                GlobalData.models[this.modelId].loaded = true
            }

            if (visible) {
                if (canvas.parentElement !== placeholder) {
                    placeholder.appendChild(canvas)
                }
                GlobalData.models[this.modelId].render()
            }
        }
    }

    checkElementVisible() {
        const rect = GlobalData.models[this.modelId].placeholder.getBoundingClientRect()
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight)
        const windowWidth = (window.innerWidth || document.documentElement.clientWidth)
        const vertInView = (rect.top <= windowHeight * 1.1) && ((rect.top + rect.height) >= windowHeight * -0.1)
        const horInView = (rect.left <= windowWidth * 1.1) && ((rect.left + rect.width) >= windowWidth * -0.1)
        GlobalData.models[this.modelId].visible = (vertInView && horInView)
    }

    createCanvases() {
        const canvas = document.createElement("canvas")
        canvas.style.width = "100%"
        canvas.style.height = "100%"
        canvas.ctx = new spine.webgl.ManagedWebGLRenderingContext(canvas, {alpha: true})
        canvas.id = "canvas-" + uuid()
        return canvas
    }

    loop() {
        this.checkElementVisible()
        this.renderDemo()
        if (!this.loopTimer) {
            this.loopTimer = setInterval(() => {
                this.loop()
            }, 1000 / this.fps)
        }
    }
}

export default ModelBaseController
