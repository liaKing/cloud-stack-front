// Base URL configuration
const BASE_URL = '/api'; // In production, this should be the full URL

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
			header['Authorization'] = token;
		}

		// Show loading by default unless explicitly disabled
		if (options.loading !== false) {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
		}

		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: header,
			success: (res) => {
				if (res.statusCode === 200) {
					// Handle business logic codes if needed
					// Assuming 200 is success, check internal code if your API uses it
					// e.g., if (res.data.code === 401) ...
					resolve(res.data);
				} else if (res.statusCode === 401) {
					// Token expired or invalid
					uni.removeStorageSync('token');
					uni.navigateTo({
						url: '/pages/login/index'
					});
					reject(res);
				} else {
					uni.showToast({
						title: res.data.msg || '请求失败',
						icon: 'none'
					});
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
