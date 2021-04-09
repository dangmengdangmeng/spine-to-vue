<template>
	<div class="download" ref="parentEle">
		<div @click="createModel">创建</div>
		<div @click="removeModel">销毁</div>
	</div>
</template>

<script>
// import CustomSpine from "../../../sdk/src/main";
import CustomSpine from "spine-to-vue";

export default {
	name: "Download",
	data() {
		return {
			files: {
				atlas: "https://sandbox-iyuyi-public.yaolantu.com/files/4a39f0ba-aac8-4802-9d5c-fcfc23a188d5_jirounan.atlas",
				json: "https://sandbox-iyuyi-public.yaolantu.com/files/5624d7e4-0e3e-4f1d-aaf8-e0b106ea7117_jirounan.json",
				images: [
					{
						name: "jirounan.png",
						url: "https://sandbox-iyuyi-public.yaolantu.com/files/ff1e55d8-0768-4d8a-81f7-78e8bd6dfae8_jirounan.png"
					}
				]
			},
			files1: {
				atlas: "https://sandbox-iyuyi-public.yaolantu.com/files/30b197da-5fd2-4eef-837f-798232e19350_boy.atlas",
				json: "https://sandbox-iyuyi-public.yaolantu.com/files/44603ea8-e39a-4db3-86e7-3686c7317bc5_boy.json",
				images: [
					{
						name: "boy.png",
						url: "https://sandbox-iyuyi-public.yaolantu.com/files/77518766-c25e-4a95-9a95-0b9b95f50a7c_boy.png"
					}
				]
			},
			modelController: null,
			status: 0
		};
	},
	methods: {
		createModel() {
			this.$nextTick().then(() => {
				const modelController = new CustomSpine.Model();
				this.modelController = modelController;
				const modelEle = document.createElement('div');
				modelEle.className = 'model-ele';
				modelEle.id = 'modelEle';
				this.$refs['parentEle'].appendChild(modelEle);
				modelController.init({files: this.status % 2 == 0 ? this.files : this.files1}).then(() => {
					this.status++;
					modelController.changeSkin(modelController.getSkins()[2]);
					modelController.load(modelEle);
				});
			});
		},
		removeModel() {
			this.$nextTick().then(() => {
				const parent = this.$refs['parentEle'];
				const modelEle = document.getElementById('modelEle');
				if (parent && modelEle) {
					parent.removeChild(modelEle);
					this.modelController = null;
				}
			});
		}
	}
};
</script>

<style scoped lang="stylus">
@import "../assets/css/app.styl"
.download
	min-height 100vh
	display flex
	align-items center
	justify-content space-around
	flex-wrap wrap
	position relative

	/deep/ .model-ele
		width 100vw
		height 100vh
		position absolute
		left 50%
		top 50%
		transform translate(-50%, -50%)
		z-index -1
</style>
