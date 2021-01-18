import * as uuid from 'uuid/v4'

class SkinController {
    constructor() {
        this.gl = null
        this.renderer = null
        this.assetManager = null
        this.offset = null
        this.bounds = null
        this.timeKeeper = null
        this.DEMO_NAME = uuid()
        this.canvas = null
        this.curSkin = '瘸腿'
        this.curAction = 'idle'
        this.skeleton = null
        this.state = null
        this.swordStatus = false
        this.loadCallback = null
        this.filePath = {
            "heroes.png": `/heroes.png`,
            "heroes2.png": `/heroes2.png`,
            "heroes.atlas": `/heroes.atlas`,
            "heroes.json": `/heroes.json`,
        }
    }

    load(canvas, spineDemos) {
        this.canvas = canvas
        this.spineDemos = spineDemos
        this.init()
    }

    init() {
        this.gl = this.canvas.ctx.gl
        this.renderer = new spine.webgl.SceneRenderer(this.canvas, this.gl)
        let textureLoader = (img) => {
            return new spine.webgl.GLTexture(this.gl, img)
        }
        this.assetManager = this.spineDemos.assetManager
        this.assetManager.loadTexture(this.DEMO_NAME, textureLoader, this.filePath["heroes.png"])
        this.assetManager.loadTexture(this.DEMO_NAME, textureLoader, this.filePath["heroes2.png"])
        this.assetManager.loadText(this.DEMO_NAME, this.filePath["heroes.atlas"])
        this.assetManager.loadJson(this.DEMO_NAME, this.filePath["heroes.json"])
        this.timeKeeper = new spine.TimeKeeper()
    }

    loadingComplete() {
        const atlas = new spine.TextureAtlas(this.assetManager.get(this.DEMO_NAME, this.filePath["heroes.atlas"]), (path) => {
            return this.assetManager.get(this.DEMO_NAME, this.filePath[path])
        })
        const atlasLoader = new spine.AtlasAttachmentLoader(atlas)
        const skeletonJson = new spine.SkeletonJson(atlasLoader)
        const skeletonData = skeletonJson.readSkeletonData(this.assetManager.get(this.DEMO_NAME, this.filePath["heroes.json"]))
        this.skeleton = new spine.Skeleton(skeletonData)
        this.skeleton.setSkinByName(this.curSkin)
        const stateData = new spine.AnimationStateData(this.skeleton.data)
        this.state = new spine.AnimationState(stateData)
        this.changeAction(this.curAction, true)
        this.state.apply(this.skeleton)
        this.skeleton.updateWorldTransform()
        this.offset = new spine.Vector2()
        this.bounds = new spine.Vector2()
        this.skeleton.getBounds(this.offset, this.bounds, [])
        if (this.loadCallback) {
            this.loadCallback()
        }
    }

    render() {
        this.timeKeeper.update()
        const {delta} = this.timeKeeper

        this.renderer.camera.position.x = this.offset.x + this.bounds.x * 1.5 - 125
        this.renderer.camera.position.y = this.offset.y + this.bounds.y / 2
        this.renderer.camera.viewportWidth = this.bounds.x * 3
        this.renderer.camera.viewportHeight = this.bounds.y * 1.2
        this.renderer.resize(spine.webgl.ResizeMode.Fit)

        this.gl.clear(this.gl.COLOR_BUFFER_BIT)

        this.state.update(delta)
        this.state.apply(this.skeleton)
        this.skeleton.updateWorldTransform()

        this.renderer.begin()
        this.renderer.drawSkeleton(this.skeleton, true)
        this.renderer.end()
    }

    changeSkin(name) {
        this.curSkin = name
        if (this.skeleton) {
            this.skeleton.setSkinByName(this.curSkin)
            this.skeleton.setSlotsToSetupPose()
        }
    }

    changeAction(name, isLoop, delay = 0) {
        this.curAction = name
        if (this.state) {
            this.state.setAnimation(0, this.curAction, isLoop, delay)
        }
    }

    swingSword(status) {
        if (status) {
            this.swordStatus = !this.swordStatus
            this.state.setAnimation(5, this.swordStatus ? "meleeSwing2" : "meleeSwing1", false, 0)
        } else {
            this.state.setAnimation(5, "empty", false, 0)
        }
    }
}

export default SkinController
