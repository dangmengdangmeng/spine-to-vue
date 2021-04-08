import Vue from 'vue';
import App from './App.vue';
import router from './routers';
import store from './stores';
import moment from 'moment';
import 'resetcss';

Vue.prototype.moment = moment;
Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
