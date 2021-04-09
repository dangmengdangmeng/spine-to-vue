import ModelController from "./controllers/ModelController";
import GlobalData from "./Global";

loadScript();
const CustomSpine = {
	Model: ModelController
};
export default CustomSpine;

function loadScript() {
	const scriptEle = document.createElement('script');
	scriptEle.src = 'https://sandbox-iyuyi-public-new.oss-cn-beijing.aliyuncs.com/spine/spine-webgl.js';
	scriptEle.onload = () => {
		GlobalData.isLoadScript = true;
	};
	document.head.appendChild(scriptEle);
}
