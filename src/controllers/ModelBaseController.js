import * as uuid from 'uuid/v4'

class ModelBaseController {
    constructor() {
        this.spineDemos = {
            HOVER_COLOR_INNER: new spine.Color(0.478, 0, 0, 0.25),
            HOVER_COLOR_OUTER: new spine.Color(1, 1, 1, 1),
            NON_HOVER_COLOR_INNER: new spine.Color(0.478, 0, 0, 0.5),
            NON_HOVER_COLOR_OUTER: new spine.Color(1, 0, 0, 0.8),
            assetManager: new spine.SharedAssetManager(''),
            demos: [],
            loopRunning: false,
            canvases: []
        }
        this.fps = 20
        this.loopTimer = null
        this.listenError()
    }

    initParams(demo, canvas) {
        this.createCanvases(1)
        this.loop()
        this.addDemo(demo, canvas)
    }

    listenError() {
        window.onerror = function (msg, url, lineNo, columnNo, error) {
            const string = msg.toLowerCase()
            const substring = "script error"
            if (string.indexOf(substring) > -1) {
                throw 'Script Error: See Browser Console for Detail'
            } else {
                throw [
                    'Message: ' + msg,
                    'URL: ' + url,
                    'Line: ' + lineNo,
                    'Column: ' + columnNo,
                    'Error object: ' + JSON.stringify(error)
                ].join(' - ')
            }
        }
    }

    renderDemo(demo) {
        const {canvas = {}, visible, placeholder} = demo
        if (!this.spineDemos.assetManager.isLoadingComplete(demo.DEMO_NAME)) {
            if (visible) {
                if (canvas.parentElement !== placeholder) {
                    placeholder.appendChild(canvas)
                }
                demo.loadingScreen.draw()
            }
        } else {
            if (!demo.loaded) {
                demo.loadingComplete()
                demo.loaded = true
            }

            if (visible) {
                if (canvas.parentElement !== placeholder) {
                    placeholder.appendChild(canvas)
                }
                demo.render()
                demo.loadingScreen.draw(true)
            }
        }
    }

    checkElementVisible(demo) {
        const rect = demo.placeholder.getBoundingClientRect()
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight)
        const windowWidth = (window.innerWidth || document.documentElement.clientWidth)
        const vertInView = (rect.top <= windowHeight * 1.1) && ((rect.top + rect.height) >= windowHeight * -0.1)
        const horInView = (rect.left <= windowWidth * 1.1) && ((rect.left + rect.width) >= windowWidth * -0.1)
        demo.visible = (vertInView && horInView)
    }

    createCanvases(numCanvases) {
        for (let i = 0; i < numCanvases; i++) {
            const canvas = document.createElement("canvas")
            canvas.width = 1
            canvas.height = 1
            canvas.ctx = new spine.webgl.ManagedWebGLRenderingContext(canvas, {alpha: true})
            canvas.id = "canvas-" + i + uuid()
            this.spineDemos.canvases.push(canvas)
        }
    }

    loop() {
        const {demos} = this.spineDemos
        for (let i = 0; i < demos.length; i++) {
            const demo = demos[i]
            this.checkElementVisible(demo)
            this.renderDemo(demo)
        }
        if (!this.loopTimer) {
            this.loopTimer = setInterval(() => {
                this.loop()
            }, 1000 / this.fps)
        }
    }

    addDemo(demo, placeholder) {
        const canvas = this.spineDemos.canvases[this.spineDemos.demos.length % this.spineDemos.canvases.length]
        demo.load(canvas, this.spineDemos)
        demo.placeholder = placeholder
        demo.canvas = canvas
        demo.visible = false
        const renderer = new spine.webgl.SceneRenderer(canvas, canvas.ctx.gl)
        demo.loadingScreen = new spine.webgl.LoadingScreen(renderer)
        this.spineDemos.demos.push(demo)
    }

}

export default ModelBaseController
