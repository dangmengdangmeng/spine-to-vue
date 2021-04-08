import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {},
	getters: {},
	mutations: {
		setData(state, obj) {
			for (let key in obj) {
				if (state.hasOwnProperty(key)) {
					state[key] = obj[key];
				}
			}
		}
	},
	actions: {
		setData({commit}, obj) {
			commit('setData', obj);
		}
	},
	modules: {

	}
});
