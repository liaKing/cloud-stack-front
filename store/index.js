import Vue from 'vue'
import Vuex from 'vuex'
import { getUserInfo } from '@/api/user.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		token: uni.getStorageSync('token') || '',
		userInfo: uni.getStorageSync('userInfo') || {},
		isLogin: !!uni.getStorageSync('token')
	},
	mutations: {
		SET_TOKEN(state, token) {
			state.token = token;
			state.isLogin = !!token;
			if (token) {
				uni.setStorageSync('token', token);
			} else {
				uni.removeStorageSync('token');
			}
		},
		SET_USER_INFO(state, info) {
			state.userInfo = info;
			uni.setStorageSync('userInfo', info);
		},
		LOGOUT(state) {
			state.token = '';
			state.userInfo = {};
			state.isLogin = false;
			uni.removeStorageSync('token');
			uni.removeStorageSync('userInfo');
		}
	},
	actions: {
		// Update user info from server
		async updateUserInfo({ commit }) {
			try {
				const res = await getUserInfo();
				if (res.code === 200 || res.code === 0) { // Adapt to your backend success code
					commit('SET_USER_INFO', res.data);
					return res.data;
				}
			} catch (e) {
				console.error('Update user info failed', e);
			}
		},
		login({ commit }, token) {
			commit('SET_TOKEN', token);
		},
		logout({ commit }) {
			commit('LOGOUT');
			uni.reLaunch({
				url: '/pages/login/index'
			});
		}
	}
})

export default store
