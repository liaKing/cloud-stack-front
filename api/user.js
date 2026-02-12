import request from '@/utils/request';

// Login
// 请求体: { userName, passWord }
// 响应 data: { access_token, refresh_token }
export const login = (data) => {
	return request({
		url: '/user/login',
		method: 'POST',
		data: {
			userName: data.userName || data.username,
			passWord: data.passWord || data.password
		}
	});
};

// 获取用户信息（按 userId 查询，无需鉴权）
export const getUserInfo = (userId) => {
	return request({
		url: '/user/userInfo',
		method: 'GET',
		params: { userId: String(userId) }
	});
};
