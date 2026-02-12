// Base URL configuration
const BASE_URL = '/api'; // In production, this should be the full URL

// Unauthorized codes: 107 未登录, 109 token 已过期
const UNAUTH_CODES = [107, 109];

// Request wrapper
const request = (options) => {
	return new Promise((resolve, reject) => {
		// Get token from storage
		const token = uni.getStorageSync('token');
		
		// Header configuration
		const header = {
			'Content-Type': 'application/json',
			...options.header
		};
		
		if (token) {
			header['Authorization'] = `Bearer ${token}`;
		}

		// Show loading by default unless explicitly disabled
		if (options.loading !== false) {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
		}

		// GET 请求用 data 作为 query，uni.request 的 data 在 GET 时会拼到 url
		const reqData = options.method === 'GET' && options.params ? options.params : (options.data || {});

		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: reqData,
			header: header,
			success: (res) => {
				if (res.statusCode === 200) {
					const body = res.data || {};
					const code = body.code;
					// 业务成功：code 为 0
					if (code === 0) {
						resolve(body);
					} else if (UNAUTH_CODES.includes(code)) {
						// token 失效或未登录
						uni.removeStorageSync('token');
						uni.removeStorageSync('userInfo');
						uni.showToast({ title: body.message || '请重新登录', icon: 'none' });
						uni.reLaunch({ url: '/pages/login/index' });
						reject(res);
					} else {
						uni.showToast({
							title: body.message || '请求失败',
							icon: 'none'
						});
						reject(res);
					}
				} else if (res.statusCode === 401) {
					uni.removeStorageSync('token');
					uni.removeStorageSync('userInfo');
					uni.reLaunch({ url: '/pages/login/index' });
					reject(res);
				} else {
					const msg = (res.data && (res.data.message || res.data.msg)) || '请求失败';
					uni.showToast({ title: msg, icon: 'none' });
					reject(res);
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				});
				reject(err);
			},
			complete: () => {
				if (options.loading !== false) {
					uni.hideLoading();
				}
			}
		});
	});
};

export default request;
