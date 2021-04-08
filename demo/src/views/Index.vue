<template>
	<div class="download" ref="parentEle">
		<div @click="createModel">创建</div>
		<div @click="removeModel">销毁</div>
		download
	</div>
</template>

<script>
import CustomSpine from "../../../sdk/src/main";

export default {
	name: "Download",
	data() {
		return {
			files: {
				atlas: "https://sandbox-iyuyi-public.yaolantu.com/files/d8beb29b-cf40-4555-8d74-d47634180484_boys.atlas",
				json: "https://sandbox-iyuyi-public.yaolantu.com/files/da0b3c62-4c46-4dcc-86b2-53f5453c789d_boys.json",
				images: [
					{
						name: "boys.png",
						url: "https://sandbox-iyuyi-public.yaolantu.com/files/7deb9665-f25a-4f1a-84bc-55c13e8938f0_boys.png"
					}
				]
			},
			files1: {
				atlas: "https://sandbox-iyuyi-public.yaolantu.com/files/b7d5f869-1ea7-411d-9fbb-95416764c7a5_boy.atlas",
				json: "https://sandbox-iyuyi-public.yaolantu.com/files/85f0ad50-14a6-41bd-9820-086a1560aa1a_boy.json",
				images: [
					{
						name: "boy.png",
						url: "https://sandbox-iyuyi-public.yaolantu.com/files/7d3a13c8-b260-4641-adb6-c79ee8b552f8_boy.png"
					}
				]
			},
			modelController: null,
			status: 0
		};
	},
	mounted() {
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
					console.error(modelController.getSkins());
					console.error(modelController.getAnimations());
					modelController.load(modelEle).then(() => {
						// modelController.changeAnimation(modelController.getAnimations()[1]);
					});
				});
			});
		},
		removeModel() {
			this.$nextTick().then(() => {
				this.$refs['parentEle'].removeChild(document.getElementById('modelEle'));
				this.modelController = null;
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

	/deep/ .model-ele
		width 400px
		height 400px

</style>
