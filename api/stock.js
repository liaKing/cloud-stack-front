import request from '@/utils/request';

// Get Official Stock List (Items)
export const getStockList = (params) => {
	return request({
		url: '/stock/list',
		method: 'GET',
		data: params
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
