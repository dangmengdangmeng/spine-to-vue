import * as uuid from 'uuid/v4'

class ModelBaseController {
    constructor() {
        this.assetManager = new spine.SharedAssetManager('')
        this.demo = null
        this.fps = 20
        this.loopTimer = null
    }

    initParams(placeholder) {
        const canvas = this.createCanvas()
        this.demo.load(canvas, this.assetManager)
        this.demo.placeholder = placeholder
        this.demo.canvas = canvas
        this.demo.visible = false
        const renderer = new spine.webgl.SceneRenderer(canvas, canvas.ctx.gl)
        this.demo.loadingScreen = new spine.webgl.LoadingScreen(renderer)
        this.loop()
    }


    renderDemo() {
        const {canvas = {}, visible, placeholder, loaded} = this.demo
        if (!loaded) {
            this.demo.loadingComplete()
            this.demo.loaded = true
        }

        if (visible) {
            if (canvas.parentElement !== placeholder) {
                placeholder.appendChild(canvas)
            }
            this.demo.render()
            this.demo.loadingScreen.draw(true)
        }
    }

    checkElementVisible() {
        const rect = this.demo.placeholder.getBoundingClientRect()
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight)
        const windowWidth = (window.innerWidth || document.documentElement.clientWidth)
        const vertInView = (rect.top <= windowHeight * 1.1) && ((rect.top + rect.height) >= windowHeight * -0.1)
        const horInView = (rect.left <= windowWidth * 1.1) && ((rect.left + rect.width) >= windowWidth * -0.1)
        this.demo.visible = (vertInView && horInView)
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
