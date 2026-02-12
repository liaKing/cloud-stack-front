import Vue from 'vue'
import Vuex from 'vuex'
import { getUserInfo } from '@/api/user.js'
import { getUserIdFromToken } from '@/utils/jwt.js'

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
		// 从服务端拉取用户信息（需已登录，从 token 解析 userId）
		async updateUserInfo({ state, commit }) {
			const token = state.token;
			if (!token) return;
			const userId = getUserIdFromToken(token);
			if (!userId) return;
			try {
				const res = await getUserInfo(userId);
				if (res.code === 0 && res.data) {
					commit('SET_USER_INFO', res.data);
					return res.data;
				}
			} catch (e) {
				console.error('Update user info failed', e);
			}
		},
		login({ commit }, accessToken) {
			commit('SET_TOKEN', accessToken);
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
