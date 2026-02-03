<template>
	<view class="container">
		<view class="user-header-card">
			<view class="header-top">
				<view class="avatar-box">
					<u-avatar :src="userInfo.avatar || ''" size="70" shape="circle" icon="account-fill" fontSize="40"></u-avatar>
				</view>
				<view class="info-box">
					<text class="username">{{ userInfo.username || '未登录用户' }}</text>
					<view class="uid-tag">
						<text>UID: {{ userInfo.id || '-' }}</text>
						<u-icon name="file-text" size="14" color="#fff" style="margin-left: 4px"></u-icon>
					</view>
				</view>
			</view>
			<view class="header-bottom">
				<view class="stat-item">
					<text class="num">{{ userInfo.luck || 0 }}</text>
					<text class="label">幸运值</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="num">-</text>
					<text class="label">总资产</text>
				</view>
			</view>
		</view>
		
		<view class="menu-section">
			<u-cell-group :border="false">
				<u-cell icon="setting-fill" title="系统设置" isLink size="large" :border="false" customStyle="padding: 16px; background-color: #fff; border-radius: 12px; margin-bottom: 10px;"></u-cell>
				<u-cell icon="server-fill" title="关于我们" isLink size="large" :border="false" customStyle="padding: 16px; background-color: #fff; border-radius: 12px; margin-bottom: 10px;"></u-cell>
				<!-- Admin Entry -->
				<u-cell icon="grid-fill" title="管理员面板" isLink size="large" :border="false" customStyle="padding: 16px; background-color: #fff; border-radius: 12px; margin-bottom: 10px;" @click="showAdmin = true"></u-cell>
			</u-cell-group>
		</view>
		
		<view class="logout-section">
			<u-button 
				type="error" 
				text="退出登录" 
				shape="circle" 
				plain 
				customStyle="height: 48px; border-width: 1px;"
				@click="handleLogout"
			></u-button>
		</view>
		
		<view class="version-text">Version 1.0.0</view>
		
		<!-- Admin Popup -->
		<u-popup :show="showAdmin" mode="bottom" @close="showAdmin = false" :round="16">
			<view class="admin-panel">
				<view class="panel-header">
					<text class="title">管理员控制台</text>
					<u-icon name="close" size="20" color="#909399" @click="showAdmin = false"></u-icon>
				</view>
				
				<u-collapse accordion :border="false">
					<u-collapse-item title="🎯 投壶数据录入">
						<view class="form-content">
							<u--input v-model="throwForm.playerPay" placeholder="玩家付费金额 (幸运值)" type="number" border="surround" class="mb-10"></u--input>
							<view class="hit-row">
								<u--input v-model="throwForm.hitItemId" placeholder="命中项目ID" border="surround" class="flex-1 mr-10"></u--input>
								<u--input v-model="throwForm.hitCount" placeholder="次数" type="number" border="surround" class="w-80"></u--input>
							</view>
							<u-button type="primary" text="提交数据" shape="circle" @click="submitThrowData" customStyle="margin-top: 16px;"></u-button>
						</view>
					</u-collapse-item>
					<u-collapse-item title="💰 每日结算触发">
						<view class="form-content">
							<view class="warn-box">
								<u-icon name="info-circle-fill" color="#f56c6c" size="16"></u-icon>
								<text class="text">高风险操作：这将强制退还所有用户的股票资金，请确认比赛已结束。</text>
							</view>
							<u-button type="error" text="确认执行结算" shape="circle" @click="doSettlement" customStyle="margin-top: 10px;"></u-button>
						</view>
					</u-collapse-item>
				</u-collapse>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { submitThrow, dailySettlement } from '@/api/admin.js';
	
	export default {
		data() {
			return {
				showAdmin: false,
				throwForm: {
					playerPay: '',
					hitItemId: '',
					hitCount: ''
				}
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			handleLogout() {
				this.$store.dispatch('logout');
			},
			async submitThrowData() {
				if (!this.throwForm.playerPay) {
					uni.showToast({ title: '请输入金额', icon: 'none' });
					return;
				}
				
				// Construct hits array
				const hits = [];
				if (this.throwForm.hitItemId && this.throwForm.hitCount) {
					hits.push({
						itemId: this.throwForm.hitItemId,
						hitCount: Number(this.throwForm.hitCount)
					});
				}
				
				const data = {
					playerPay: Number(this.throwForm.playerPay),
					totalItems: 10, // Hardcoded or dynamic? Doc says "totalItems" in req.
					hits: hits
				};
				
				try {
					const res = await submitThrow(data);
					if (res.code === 200 || res.code === 0) {
						uni.showToast({ title: '录入成功', icon: 'success' });
						this.throwForm = { playerPay: '', hitItemId: '', hitCount: '' };
					} else {
						uni.showToast({ title: res.msg || '失败', icon: 'none' });
					}
				} catch (e) {
					console.error(e);
				}
			},
			async doSettlement() {
				try {
					const res = await dailySettlement({});
					if (res.code === 200 || res.code === 0) {
						uni.showToast({ title: '结算已触发', icon: 'success' });
					} else {
						uni.showToast({ title: res.msg || '失败', icon: 'none' });
					}
				} catch (e) {
					console.error(e);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.container {
	padding: 16px;
	background-color: #f5f7fa;
	min-height: 100vh;
}

.user-header-card {
	background: linear-gradient(135deg, #2979ff, #609cff);
	border-radius: 16px;
	padding: 24px;
	color: #fff;
	margin-bottom: 24px;
	box-shadow: 0 8px 20px rgba(41, 121, 255, 0.25);
	
	.header-top {
		display: flex;
		align-items: center;
		margin-bottom: 24px;
		
		.avatar-box {
			border: 2px solid rgba(255,255,255,0.5);
			border-radius: 50%;
		}
		
		.info-box {
			margin-left: 16px;
			
			.username {
				font-size: 20px;
				font-weight: bold;
				margin-bottom: 6px;
				display: block;
			}
			
			.uid-tag {
				background-color: rgba(255,255,255,0.2);
				padding: 2px 8px;
				border-radius: 4px;
				font-size: 12px;
				display: inline-flex;
				align-items: center;
			}
		}
	}
	
	.header-bottom {
		display: flex;
		justify-content: space-around;
		align-items: center;
		
		.stat-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			
			.num {
				font-size: 24px;
				font-weight: bold;
				margin-bottom: 4px;
			}
			
			.label {
				font-size: 12px;
				opacity: 0.8;
			}
		}
		
		.stat-divider {
			width: 1px;
			height: 30px;
			background-color: rgba(255,255,255,0.2);
		}
	}
}

.menu-section {
	margin-bottom: 30px;
}

.logout-section {
	padding: 0 10px;
}

.version-text {
	text-align: center;
	color: #c0c4cc;
	font-size: 12px;
	margin-top: 20px;
}

.admin-panel {
	padding: 20px;
	background-color: #fff;
	
	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		
		.title {
			font-size: 18px;
			font-weight: bold;
			color: #303133;
		}
	}
	
	.form-content {
		padding: 10px 0;
		
		.mb-10 {
			margin-bottom: 10px;
		}
		
		.hit-row {
			display: flex;
			
			.flex-1 { flex: 1; }
			.mr-10 { margin-right: 10px; }
			.w-80 { width: 80px; }
		}
		
		.warn-box {
			background-color: #fef0f0;
			padding: 10px;
			border-radius: 8px;
			display: flex;
			align-items: flex-start;
			gap: 6px;
			margin-bottom: 10px;
			
			.text {
				font-size: 12px;
				color: #f56c6c;
				line-height: 1.4;
			}
		}
	}
}
</style>
