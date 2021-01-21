import * as uuid from 'uuid/v4'
import GlobalData from "../Global"

class ModelBaseController {
    constructor() {
        this.spineDemos = {
            assetManager: new spine.SharedAssetManager(''),
        }
        this.fps = 20
        this.loopTimer = null
    }

    initParams(placeholder) {
        const canvas = this.createCanvas()
        GlobalData.demo.load(canvas, this.spineDemos.assetManager)
        GlobalData.demo.placeholder = placeholder
        GlobalData.demo.canvas = canvas
        GlobalData.demo.visible = false
        const renderer = new spine.webgl.SceneRenderer(canvas, canvas.ctx.gl)
        GlobalData.demo.loadingScreen = new spine.webgl.LoadingScreen(renderer)
        this.loop()
    }


    renderDemo() {
        const {canvas = {}, visible, placeholder, loaded} = GlobalData.demo
        if (!loaded) {
            GlobalData.demo.loadingComplete()
            GlobalData.demo.loaded = true
        }

        if (visible) {
            if (canvas.parentElement !== placeholder) {
                placeholder.appendChild(canvas)
            }
            GlobalData.demo.render()
            GlobalData.demo.loadingScreen.draw(true)
        }
    }

    checkElementVisible() {
        const rect = GlobalData.demo.placeholder.getBoundingClientRect()
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight)
        const windowWidth = (window.innerWidth || document.documentElement.clientWidth)
        const vertInView = (rect.top <= windowHeight * 1.1) && ((rect.top + rect.height) >= windowHeight * -0.1)
        const horInView = (rect.left <= windowWidth * 1.1) && ((rect.left + rect.width) >= windowWidth * -0.1)
        GlobalData.demo.visible = (vertInView && horInView)
    }

    createCanvas() {
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
