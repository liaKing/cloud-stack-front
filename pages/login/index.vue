<template>
	<view class="login-container">
		<view class="logo-box">
			<image style="width: 100px; height: 100px; border-radius: 50%; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" src="/static/logo.png" mode="aspectFill"></image>
			<text class="title">TaoQuan Trading</text>
			<text class="subtitle">投壶与交易的即时市场</text>
		</view>
		
		<view class="form-card">
			<view class="welcome-text">欢迎回来</view>
			<u--form labelPosition="left" :model="form" ref="uForm">
				<u-form-item prop="username" class="custom-input">
					<u--input 
						v-model="form.username" 
						placeholder="请输入用户名" 
						border="none" 
						prefixIcon="account"
						prefixIconStyle="font-size: 22px; color: #909399"
					></u--input>
				</u-form-item>
				<u-form-item prop="password" class="custom-input">
					<u--input 
						v-model="form.password" 
						type="password" 
						placeholder="请输入密码" 
						border="none"
						prefixIcon="lock"
						prefixIconStyle="font-size: 22px; color: #909399"
					></u--input>
				</u-form-item>
			</u--form>
			
			<view class="btn-box">
				<u-button 
					type="primary" 
					text="登录" 
					shape="circle" 
					customStyle="height: 44px; box-shadow: 0 4px 10px rgba(41, 121, 255, 0.3);"
					@click="handleLogin" 
					:loading="loading"
				></u-button>
			</view>
		</view>
		
		<view class="footer-text">
			&copy; 2026 TaoQuan System
		</view>
	</view>
</template>

<script>
	import { login } from '@/api/user.js';
	
	export default {
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
					const res = await login(this.form);
					// Assuming response format: { code: 200, data: { token: '...' }, msg: '...' }
					// Adjust based on actual API response
					if (res.code === 200 || res.code === 0) {
						this.$store.dispatch('login', res.data.token); // Store token
						this.$store.dispatch('updateUserInfo'); // Fetch user info
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
							title: res.msg || '登录失败',
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
.login-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
	padding: 60px 30px;
	display: flex;
	flex-direction: column;
	align-items: center;
	
	.logo-box {
		margin-bottom: 40px;
		display: flex;
		flex-direction: column;
		align-items: center;
		
		.logo-img {
			box-shadow: 0 4px 15px rgba(0,0,0,0.1);
		}
		
		.title {
			margin-top: 20px;
			font-size: 28px;
			font-weight: 800;
			color: #303133;
			letter-spacing: 1px;
		}
		
		.subtitle {
			margin-top: 8px;
			font-size: 14px;
			color: #606266;
			letter-spacing: 0.5px;
		}
	}
	
	.form-card {
		width: 100%;
		background: #ffffff;
		border-radius: 16px;
		padding: 30px 20px;
		box-shadow: 0 10px 30px rgba(0,0,0,0.05);
		
		.welcome-text {
			font-size: 20px;
			font-weight: bold;
			color: #303133;
			margin-bottom: 25px;
		}
		
		.custom-input {
			background-color: #f5f7fa;
			border-radius: 8px;
			margin-bottom: 20px;
			padding: 4px 10px;
		}
		
		.btn-box {
			margin-top: 30px;
		}
	}
	
	.footer-text {
		margin-top: auto;
		font-size: 12px;
		color: #909399;
	}
}
</style>
