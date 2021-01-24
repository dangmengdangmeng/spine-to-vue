import ModelService from "../services/model/ModelService"

class SkinController {
    constructor() {
        this.gl = null
        this.renderer = null
        this.offset = null
        this.bounds = null
        this.timeKeeper = null
        this.DEMO_NAME = null
        this.curSkin = ''
        this.curAction = ''
        this.skeleton = null
        this.files = []
        this.state = null
        this.swordStatus = false
        this.loadCallback = null
    }

    load(canvas, assetManager) {
        this.gl = canvas.ctx.gl
        this.renderer = new spine.webgl.SceneRenderer(canvas, this.gl)
        let textureLoader = (img) => {
            return new spine.webgl.GLTexture(this.gl, img)
        }
        this.files.images.map(item => {
            assetManager.loadTexture(this.DEMO_NAME, textureLoader, item.url)
        })
        assetManager.loadText(this.DEMO_NAME, this.files['atlas'])
        assetManager.loadJson(this.DEMO_NAME, this.files['json'])
        this.timeKeeper = new spine.TimeKeeper()
    }

    loadingComplete(assetManager) {
        const atlas = new spine.TextureAtlas(assetManager.get(this.DEMO_NAME, this.files['atlas']), (path) => {
            return assetManager.get(this.DEMO_NAME, this.getFilePath(path))
        })
        const atlasLoader = new spine.AtlasAttachmentLoader(atlas)
        const skeletonJson = new spine.SkeletonJson(atlasLoader)
        const skeletonData = skeletonJson.readSkeletonData(assetManager.get(this.DEMO_NAME, this.files['json']))
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

    //获取json中的皮肤和动画
    getJsonInfo(url) {
        return new Promise(resolve => {
            ModelService.getJsonInfo(url).then(response => {
                const {skins, animations} = response
                this.skins = this.filterSkins(skins)
                this.curSkin = this.curSkin || this.skins[0] || ''
                this.animations = this.filterAnimations(animations)
                this.curAction = this.curAction || this.animations[0] || ''
                resolve()
            })
        })
    }

    filterSkins(skins) {
        let items = []
        skins.map(item => {
            if (item && item.name && item.name !== 'default') {
                items.push(item.name)
            }
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

    getFilePath(name) {
        return (this.files.images.find(item => item.name === name)).url
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

    changeAction(name, isLoop = false) {
        this.curAction = name
        if (this.state) {
            this.state.setAnimation(0, this.curAction, isLoop)
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
