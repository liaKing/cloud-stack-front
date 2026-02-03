import request from '@/utils/request';

// Submit Throw Result
export const submitThrow = (data) => {
	return request({
		url: '/admin/throw/submit',
		method: 'POST',
		data
	});
};

// Daily Settlement
export const dailySettlement = (data) => {
	return request({
		url: '/admin/settlement/daily',
		method: 'POST',
		data
	});
};

// Abolish Item
export const abolishItem = (data) => {
	return request({
		url: '/admin/item/abolish',
		method: 'POST',
		data
	});
};

// Batch Create/Update Items
export const batchItems = (data) => {
	return request({
		url: '/admin/item/batch',
		method: 'POST',
		data
	});
};

// Register User (Admin)
export const adminRegister = (data) => {
	return request({
		url: '/user/admin/register',
		method: 'POST',
		data
	});
};

// Delete User (Admin)
export const adminDeleteUser = (data) => {
	return request({
		url: '/user/admin/del',
		method: 'POST',
		data
	});
};

// Adjust Luck (Admin)
export const adminDoLuck = (data) => {
	return request({
		url: '/user/admin/doluck',
		method: 'POST',
		data
	});
};
