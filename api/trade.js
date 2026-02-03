import request from '@/utils/request';

// Get Trade Orders
export const getTradeOrders = (params) => {
	return request({
		url: '/trade/orders',
		method: 'GET',
		data: params
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

// Trade Records (Optional)
export const getTradeRecords = (params) => {
	return request({
		url: '/trade/records',
		method: 'GET',
		data: params
	});
};
