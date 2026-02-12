<template>
	<view class="container">
		<!-- Asset Card -->
		<view class="asset-card">
			<view class="card-bg-circle"></view>
			<view class="card-content">
				<view class="card-title">当前幸运值</view>
				<view class="card-balance">
					<u-count-to :startVal="0" :endVal="userInfo.luck || 0" :decimals="2" color="#fff" fontSize="36" bold></u-count-to>
				</view>
				<view class="card-footer">
					<view class="footer-item">
						<text class="label">持仓项目</text>
						<text class="val">{{ stockList.length }}</text>
					</view>
					<view class="refresh-btn" @click="fetchData">
						<u-icon name="reload" color="#fff" size="18"></u-icon>
						<text>刷新</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- Holdings -->
		<view class="section-box">
			<view class="section-header">
				<view class="title-left">
					<u-icon name="bag-fill" color="#2979ff" size="20"></u-icon>
					<text class="title">我的持仓</text>
				</view>
			</view>
			
			<view class="holdings-list">
				<view class="holding-card" v-for="(item, index) in stockList" :key="item.stockUserId || index">
					<view class="card-icon">
						<text class="icon-text">{{ (item.stockName || '项')[0] }}</text>
					</view>
					<view class="card-info">
						<text class="item-name">{{ item.stockName || '项目 ' + item.stockId }}</text>
						<text class="item-id">ID: {{ item.stockId }}</text>
					</view>
					<view class="card-value">
						<text class="qty-label">持仓量</text>
						<text class="qty-val">{{ item.stockNumber }}</text>
					</view>
				</view>
				<u-empty v-if="stockList.length === 0" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png" text="暂无持仓数据"></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
	import { getUserStock } from '@/api/stock.js';
	import { getUserInfo } from '@/api/user.js';
	import { mapState } from 'vuex';
	
	export default {
		data() {
			return {
				stockList: []
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onShow() {
			this.fetchData();
		},
		onPullDownRefresh() {
			this.fetchData().finally(() => {
				uni.stopPullDownRefresh();
			});
		},
		methods: {
			fetchData() {
				this.$store.dispatch('updateUserInfo');
				return this.fetchStock();
			},
			async fetchStock() {
				try {
					const res = await getUserStock();
					if (res.code === 0 && res.data) {
						// 接口返回 StockUser[] 数组，可能直接是 data 或 data 为数组
						this.stockList = Array.isArray(res.data) ? res.data : [];
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

.asset-card {
	position: relative;
	background: linear-gradient(135deg, #2979ff, #609cff);
	border-radius: 16px;
	padding: 24px;
	color: #fff;
	margin-bottom: 24px;
	box-shadow: 0 8px 20px rgba(41, 121, 255, 0.3);
	overflow: hidden;
	
	.card-bg-circle {
		position: absolute;
		top: -20px;
		right: -20px;
		width: 100px;
		height: 100px;
		background: rgba(255,255,255,0.1);
		border-radius: 50%;
	}
	
	.card-content {
		position: relative;
		z-index: 1;
		
		.card-title {
			font-size: 14px;
			opacity: 0.8;
			margin-bottom: 8px;
		}
		
		.card-balance {
			margin-bottom: 20px;
		}
		
		.card-footer {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			
			.footer-item {
				display: flex;
				flex-direction: column;
				
				.label {
					font-size: 12px;
					opacity: 0.8;
				}
				
				.val {
					font-size: 18px;
					font-weight: bold;
					margin-top: 4px;
				}
			}
			
			.refresh-btn {
				display: flex;
				align-items: center;
				gap: 4px;
				background: rgba(255,255,255,0.2);
				padding: 6px 12px;
				border-radius: 20px;
				font-size: 12px;
				transition: background 0.2s;
				
				&:active {
					background: rgba(255,255,255,0.3);
				}
			}
		}
	}
}

.section-box {
	.section-header {
		margin-bottom: 16px;
		
		.title-left {
			display: flex;
			align-items: center;
			gap: 8px;
			
			.title {
				font-size: 18px;
				font-weight: bold;
				color: #303133;
			}
		}
	}
}

.holdings-list {
	.holding-card {
		background-color: #fff;
		border-radius: 12px;
		padding: 16px;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		box-shadow: 0 2px 8px rgba(0,0,0,0.03);
		
		.card-icon {
			width: 48px;
			height: 48px;
			background-color: #ecf5ff;
			border-radius: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 16px;
			
			.icon-text {
				font-size: 20px;
				font-weight: bold;
				color: #2979ff;
			}
		}
		
		.card-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 4px;
			
			.item-name {
				font-size: 16px;
				font-weight: bold;
				color: #303133;
			}
			
			.item-id {
				font-size: 12px;
				color: #909399;
			}
		}
		
		.card-value {
			text-align: right;
			
			.qty-label {
				font-size: 12px;
				color: #909399;
				display: block;
			}
			
			.qty-val {
				font-size: 18px;
				font-weight: bold;
				color: #303133;
			}
		}
	}
}
</style>
