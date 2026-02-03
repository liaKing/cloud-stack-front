import request from '@/utils/request';

// Login
export const login = (data) => {
	return request({
		url: '/user/login',
		method: 'POST',
		data
	});
};

// Get User Info
export const getUserInfo = () => {
	return request({
		url: '/user/get',
		method: 'POST'
	});
};
