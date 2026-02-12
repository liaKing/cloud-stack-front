import request from '@/utils/request';

// 挂单列表
// params: itemId, orderType(1=卖 2=买), priceMin, priceMax, pageNum, pageSize
// 响应 data: { list, total, pageNum, pageSize }
export const getTradeOrders = (params = {}) => {
	return request({
		url: '/trade/orders',
		method: 'GET',
		params
	});
};

// Post Buy Order
export const postBuyOrder = (data) => {
	return request({
		url: '/trade/buy',
		method: 'PUT',
		data
	});
};

// Post Sell Order
export const postSellOrder = (data) => {
	return request({
		url: '/trade/sell',
		method: 'PUT',
		data
	});
};

// Accept Order (Trade)
export const acceptOrder = (data) => {
	return request({
		url: '/trade/accept',
		method: 'PUT',
		data
	});
};

// Cancel Order
export const cancelOrder = (data) => {
	return request({
		url: '/trade/cancel',
		method: 'PUT',
		data
	});
};

// 成交记录
export const getTradeRecords = (params = {}) => {
	return request({
		url: '/trade/records',
		method: 'GET',
		params
	});
};
