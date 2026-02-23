<template>
	<view class="login-page">
	<view class="login-container">
		<view class="login-content">
			<view class="logo-box">
				<image class="logo-img" src="/static/logo.png" mode="aspectFill"></image>
				<text class="title">TaoQuan Trading</text>
				<text class="subtitle">投壶与交易的即时市场</text>
			</view>
			
			<view class="form-card">
			<view class="welcome-text">欢迎回来</view>
			<view class="input-group">
				<text class="input-label">用户名</text>
				<input 
					class="input-field"
					v-model="form.username" 
					placeholder="请输入用户名"
				/>
			</view>
			<view class="input-group">
				<text class="input-label">密码</text>
				<input 
					class="input-field"
					v-model="form.password" 
					type="password"
					placeholder="请输入密码"
				/>
			</view>
			
			<view class="btn-box">
				<u-button 
					type="primary" 
					shape="circle" 
					:ripple="true"
					text="登录"
					@click="handleLogin" 
					:loading="loading"
					:customStyle="{
						width: '100%',
						height: '44px',
						boxShadow: '0 4px 10px rgba(41, 121, 255, 0.3)'
					}"
				></u-button>
			</view>
		</view>
		</view>
		
		<view class="footer-text">
			&copy; 2026 TaoQuan System
		</view>
	</view>
	</view>
</template>

<script>
	import { login } from '@/api/user.js';
	import uButton from 'uview-ui/components/u-button/u-button.vue';
	
	export default {
		components: {
			uButton
		},
		data() {
			return {
				form: {
					username: '',
					password: ''
				},
				loading: false
			}
		},
		methods: {
			async handleLogin() {
				if (!this.form.username || !this.form.password) {
					uni.showToast({
						title: '请输入用户名和密码',
						icon: 'none'
					});
					return;
				}
				
				this.loading = true;
				try {
					const res = await login({
						userName: this.form.username,
						passWord: this.form.password
					});
					if (res.code === 0 && res.data) {
						const accessToken = res.data.access_token;
						this.$store.dispatch('login', accessToken);
						this.$store.dispatch('updateUserInfo');
						uni.showToast({
							title: '登录成功',
							icon: 'success'
						});
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/index/index'
							});
						}, 1000);
					} else {
						uni.showToast({
							title: (res.message || res.msg) || '登录失败',
							icon: 'none'
						});
					}
				} catch (e) {
					console.error(e);
				} finally {
					this.loading = false;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
/* 外层包裹：限制在视口内，防止溢出导致左侧被裁切 */
.login-page {
	width: 100%;
	min-height: 100vh;
	overflow-x: hidden;
	box-sizing: border-box;
}

.login-container {
	position: relative;
	width: 100%;
	min-height: 100vh;
	background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
	padding: 30px 24px;
	box-sizing: border-box;
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	
	.login-content {
		display: block;
		width: 100%;
		max-width: 360px;
		text-align: left;
		box-sizing: border-box;
		flex-shrink: 0;
	}
	
	.logo-box {
		margin-bottom: 32px;
		display: flex;
		flex-direction: column;
		align-items: center;
		
		.logo-img {
			width: 80px;
			height: 80px;
			border-radius: 50%;
			box-shadow: 0 4px 15px rgba(0,0,0,0.1);
		}
		
		.title {
			margin-top: 16px;
			font-size: 24px;
			font-weight: 800;
			color: #303133;
			letter-spacing: 1px;
		}
		
		.subtitle {
			margin-top: 6px;
			font-size: 13px;
			color: #606266;
			letter-spacing: 0.5px;
		}
	}
	
	.form-card {
		width: 100%;
		background: #ffffff;
		border-radius: 16px;
		padding: 30px 20px 24px;
		box-shadow: 0 10px 30px rgba(0,0,0,0.05);
		box-sizing: border-box;
		/* 使用 Flex 布局确保内容垂直排列，避免高度塌陷 */
		display: flex;
		flex-direction: column;
		position: relative;
		overflow: hidden;
		
		.welcome-text {
			font-size: 20px;
			font-weight: bold;
			color: #303133;
			margin-bottom: 25px;
			display: block;
		}
		
		.input-group {
			margin-bottom: 20px;
			
			.input-label {
				display: block;
				font-size: 14px;
				color: #606266;
				margin-bottom: 8px;
			}
			
			.input-field {
				display: block;
				width: 100%;
				height: 44px;
				padding: 0 16px;
				background-color: #f5f7fa;
				border: 1px solid #e4e7ed;
				border-radius: 8px;
				font-size: 15px;
				color: #303133;
				box-sizing: border-box;
			}
			
			.input-field::placeholder {
				color: #c0c4cc;
			}
		}
		
		.btn-box {
			width: 100%;
			margin-top: 30px;
			padding-bottom: 8px;
			box-sizing: border-box;
		}
	}
	
	.footer-text {
		position: absolute;
		bottom: 20px;
		left: 0;
		right: 0;
		text-align: center;
		font-size: 12px;
		color: #909399;
	}
}
</style>

<style lang="scss">
/* 非 scoped：修复 uni-app 页面容器可能导致的布局异常 */
page {
	width: 100%;
	overflow-x: hidden;
}
</style>
