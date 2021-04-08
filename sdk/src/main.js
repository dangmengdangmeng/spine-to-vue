import ModelController from "./controllers/ModelController";

loadScript();
const CustomSpine = {
	Model: ModelController
};
export default CustomSpine;

function loadScript() {
	const scriptEle = document.createElement('script');
	scriptEle.src = 'https://sandbox-iyuyi-public-new.oss-cn-beijing.aliyuncs.com/spine/spine-webgl.js';
	document.head.appendChild(scriptEle);
}
