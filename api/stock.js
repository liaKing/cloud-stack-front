import request from '@/utils/request';

// 获取项目列表（分页）
// params: pageNum, pageSize, status(1=立项中 2=已淘汰 3=游戏中 4=已结算)
// 响应 data: { list, total, pageNum, pageSize }
export const getStockList = (params = {}) => {
	return request({
		url: '/stock/item/list',
		method: 'GET',
		params
	});
};

// Buy Official Stock
export const buyStock = (data) => {
	return request({
		url: '/stock/buy',
		method: 'PUT',
		data
	});
};

// Get User Holdings
export const getUserStock = () => {
	return request({
		url: '/stock/user',
		method: 'GET'
	});
};
