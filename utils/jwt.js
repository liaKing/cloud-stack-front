/**
 * 从 JWT access_token 中解析出 userId
 * 支持 payload 中的 userId、user_id、sub 字段
 */
export function getUserIdFromToken(token) {
	if (!token || typeof token !== 'string') return null;
	try {
		const parts = token.split('.');
		if (parts.length !== 3) return null;
		let payload = parts[1];
		// base64url 转 base64
		payload = payload.replace(/-/g, '+').replace(/_/g, '/');
		const pad = payload.length % 4;
		if (pad) payload += new Array(5 - pad).join('=');
		const decoded = decodeURIComponent(
			escape(atob(payload))
		);
		const obj = JSON.parse(decoded);
		return String(obj.userId || obj.user_id || obj.sub || '');
	} catch (e) {
		return null;
	}
}
