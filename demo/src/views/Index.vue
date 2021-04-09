<template>
	<div class="download" ref="parentEle">
		<div @click="createModel">创建</div>
		<div @click="removeModel">销毁</div>
	</div>
</template>

<script>
import CustomSpine from "../../../sdk/src/main";
// import CustomSpine from "spine-to-vue";

export default {
	name: "Download",
	data() {
		return {
			files: {
				atlas: "https://sandbox-iyuyi-public.yaolantu.com/files/22456fbc-475b-4469-b503-6e9fb9be4b31_skeleton.atlas",
				json: "https://sandbox-iyuyi-public.yaolantu.com/files/5df2c056-2d8c-46eb-9c16-d89a48655226_skeleton.json",
				images: [
					{
						name: "skeleton.png",
						url: "https://sandbox-iyuyi-public.yaolantu.com/files/f8d8af8b-ef65-4f97-8a07-4f60c86ac6b0_skeleton.png"
					}
				]
			},
			modelController: null,
		};
	},
	mounted() {
		this.createModel();
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
				modelController.init({files: this.files}).then(() => {
					modelController.changeSkin(modelController.getSkins()[1]);
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
