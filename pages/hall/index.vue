<template>
	<view class="container">
		<!-- Tabs -->
		<u-sticky bgColor="#f5f7fa">
			<view class="tab-wrapper">
				<u-subsection 
					:list="tabList" 
					:current="currentTab" 
					@change="sectionChange"
					activeColor="#2979ff"
					bgColor="#ffffff"
					mode="button"
				></u-subsection>
			</view>
		</u-sticky>
		
		<!-- Orders List -->
		<view class="order-list">
			<view class="order-card" v-for="(item, index) in orderList" :key="index">
				<view class="card-left">
					<view class="item-name">{{ getItemName(item.itemId) }}</view>
					<view class="user-info">
						<u-icon name="account" size="14" color="#909399"></u-icon>
						<text class="username">用户 {{ (item.initiatorId || '').toString().slice(-6) || '-' }}</text>
					</view>
				</view>
				
				<view class="card-center">
					<view class="price-box">
						<text class="currency">¥</text>
						<text class="price">{{ item.price }}</text>
					</view>
					<view class="qty">可交易: {{ item.remaining !== undefined ? item.remaining : item.quantity }}</view>
				</view>
				
				<view class="card-right">
					<u-button 
						:type="currentTab === 0 ? 'success' : 'warning'" 
						:text="currentTab === 0 ? '购买' : '出售'" 
						size="small" 
						shape="circle"
						customStyle="height: 32px; padding: 0 16px; font-weight: bold;"
						@click="openAcceptModal(item)"
					></u-button>
				</view>
			</view>
			<u-empty v-if="orderList.length === 0" mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png" text="暂无交易挂单"></u-empty>
		</view>
		
		<!-- FAB for Posting -->
		<view class="fab-container" @click="showPostModal = true">
			<u-icon name="plus" color="#fff" size="28"></u-icon>
		</view>
		
		<!-- Accept Modal -->
		<u-modal :show="showAcceptModal" :title="currentTab === 0 ? '购买股票' : '出售股票'" showCancelButton confirmColor="#2979ff" @confirm="handleAccept" @cancel="showAcceptModal = false">
			<view class="modal-content">
				<view class="trade-summary">
					<view class="summary-item">
						<text class="label">交易单价</text>
						<text class="value highlight">{{ currentOrder.price }}</text>
					</view>
					<view class="summary-item">
						<text class="label">可交易量</text>
						<text class="value">{{ currentOrder.remaining !== undefined ? currentOrder.remaining : currentOrder.quantity }}</text>
					</view>
				</view>
				
				<view class="input-area">
					<u-input 
						v-model="acceptQuantity" 
						placeholder="请输入交易数量" 
						type="number" 
						border="surround"
						shape="circle"
					>
						<template slot="suffix">
							<text class="input-suffix">股</text>
						</template>
					</u-input>
				</view>
				
				<view class="total-calc" v-if="acceptQuantity">
					<text class="label">{{ currentTab === 0 ? '预计支付' : '预计收益' }}</text>
					<text class="amount">{{ acceptQuantity * currentOrder.price }} 幸运值</text>
				</view>
			</view>
		</u-modal>
		
		<!-- Post Modal -->
		<u-popup :show="showPostModal" mode="bottom" @close="showPostModal = false" :round="16">
			<view class="popup-content">
				<view class="popup-header">
					<text class="title">发布挂单</text>
					<u-icon name="close" size="20" color="#909399" @click="showPostModal = false"></u-icon>
				</view>
				
				<view class="form-body">
					<view class="type-selector">
						<view 
							class="type-item" 
							:class="{ active: postForm.type === 1, sell: postForm.type === 1 }"
							@click="postForm.type = 1"
						>
							<text>我要卖出</text>
							<u-icon v-if="postForm.type === 1" name="checkmark-circle-fill" color="#f56c6c" size="18"></u-icon>
						</view>
						<view 
							class="type-item" 
							:class="{ active: postForm.type === 2, buy: postForm.type === 2 }"
							@click="postForm.type = 2"
						>
							<text>我要求购</text>
							<u-icon v-if="postForm.type === 2" name="checkmark-circle-fill" color="#19be6b" size="18"></u-icon>
						</view>
					</view>
					
					<u-form labelPosition="top" :model="postForm" ref="postForm">
						<u-form-item label="选择项目" borderBottom @click="showItemSelect = true">
							<u-input v-model="postForm.itemName" disabled disabledColor="#ffffff" placeholder="点击选择项目" border="none"></u-input>
							<u-icon slot="right" name="arrow-right" color="#c0c4cc"></u-icon>
						</u-form-item>
						
						<view class="input-row">
							<u-form-item label="单价 (幸运值)" prop="price" class="half-width">
								<u-input v-model="postForm.price" type="number" placeholder="0.00" border="surround"></u-input>
							</u-form-item>
							<u-form-item label="数量 (股)" prop="quantity" class="half-width">
								<u-input v-model="postForm.quantity" type="number" placeholder="0" border="surround"></u-input>
							</u-form-item>
						</view>
					</u-form>
					
					<view class="btn-group">
						<u-button 
							type="primary" 
							text="确认发布" 
							shape="circle" 
							customStyle="height: 44px; font-size: 16px;"
							@click="handlePost"
						></u-button>
					</view>
				</view>
			</view>
		</u-popup>
		
		<!-- Item Selector -->
		<u-picker :show="showItemSelect" :columns="[itemListNames]" @confirm="itemSelectConfirm" @cancel="showItemSelect = false"></u-picker>
	</view>
</template>

<script>
	import { getTradeOrders, postBuyOrder, postSellOrder, acceptOrder } from '@/api/trade.js';
	import { getStockList } from '@/api/stock.js';
	
	export default {
		data() {
			return {
				tabList: [{ name: '出售大厅' }, { name: '求购大厅' }],
				currentTab: 0,
				orderList: [],
				itemList: [],
				
				showAcceptModal: false,
				currentOrder: {},
				acceptQuantity: '',
				
				showPostModal: false,
				postForm: {
					type: 1, // 1=Sell, 2=Buy
					itemId: '',
					itemName: '',
					price: '',
					quantity: ''
				},
				
				showItemSelect: false,
			}
		},
		computed: {
			itemListNames() {
				return this.itemList.map(item => item.name);
			}
		},
		onShow() {
			this.fetchItems(); // Need item mapping
			this.fetchOrders();
		},
		onPullDownRefresh() {
			this.fetchOrders().finally(() => {
				uni.stopPullDownRefresh();
			});
		},
		methods: {
			sectionChange(index) {
				this.currentTab = index;
				this.fetchOrders();
			},
			async fetchItems() {
				try {
					const res = await getStockList();
					if (res.code === 0 && res.data) {
						this.itemList = res.data.list || [];
					}
				} catch (e) {}
			},
			getItemName(id) {
				const item = this.itemList.find(i => i.id === id);
				return item ? item.name : id;
			},
			async fetchOrders() {
				try {
					const orderType = this.currentTab === 0 ? 1 : 2;
					const res = await getTradeOrders({ orderType });
					if (res.code === 0 && res.data) {
						this.orderList = res.data.list || [];
					}
				} catch (e) {}
			},
			openAcceptModal(item) {
				this.currentOrder = item;
				this.acceptQuantity = '';
				this.showAcceptModal = true;
			},
			async handleAccept() {
				if (!this.acceptQuantity || this.acceptQuantity <= 0) {
					uni.showToast({ title: '请输入有效数量', icon: 'none' });
					return;
				}
				
				try {
					const res = await acceptOrder({
						orderId: this.currentOrder.id, // Assuming id field
						quantity: Number(this.acceptQuantity)
					});
					
					if (res.code === 0) {
						uni.showToast({ title: '交易成功', icon: 'success' });
						this.showAcceptModal = false;
						this.fetchOrders();
						this.$store.dispatch('updateUserInfo');
					} else {
						uni.showToast({ title: (res.message || res.msg) || '交易失败', icon: 'none' });
					}
				} catch (e) {
					console.error(e);
				}
			},
			itemSelectConfirm(e) {
				const index = e.indexs[0];
				const item = this.itemList[index];
				this.postForm.itemId = item.id;
				this.postForm.itemName = item.name;
				this.showItemSelect = false;
			},
			async handlePost() {
				if (!this.postForm.itemId || !this.postForm.price || !this.postForm.quantity) {
					uni.showToast({ title: '请填写完整', icon: 'none' });
					return;
				}
				
				const data = {
					itemId: this.postForm.itemId,
					price: Number(this.postForm.price),
					quantity: Number(this.postForm.quantity)
				};
				
				try {
					let res;
					if (this.postForm.type === 1) {
						res = await postSellOrder(data);
					} else {
						res = await postBuyOrder(data);
					}
					
					if (res.code === 0) {
						uni.showToast({ title: '发布成功', icon: 'success' });
						this.showPostModal = false;
						this.postForm = { type: 1, itemId: '', itemName: '', price: '', quantity: '' };
						this.fetchOrders();
					} else {
						uni.showToast({ title: (res.message || res.msg) || '发布失败', icon: 'none' });
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
	padding: 0;
	background-color: #f5f7fa;
	min-height: 100vh;
	padding-bottom: 80px;
}

.tab-wrapper {
	padding: 10px 16px;
	background-color: #ffffff;
	box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}

.order-list {
	padding: 16px;
	
	.order-card {
		background-color: #ffffff;
		border-radius: 12px;
		padding: 16px;
		margin-bottom: 12px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 2px 8px rgba(0,0,0,0.02);
		
		.card-left {
			flex: 1;
			
			.item-name {
				font-size: 16px;
				font-weight: bold;
				color: #303133;
				margin-bottom: 6px;
			}
			
			.user-info {
				display: flex;
				align-items: center;
				gap: 4px;
				
				.username {
					font-size: 12px;
					color: #909399;
				}
			}
		}
		
		.card-center {
			text-align: center;
			margin: 0 16px;
			
			.price-box {
				color: #2979ff;
				font-weight: bold;
				
				.currency {
					font-size: 12px;
					margin-right: 2px;
				}
				
				.price {
					font-size: 18px;
				}
			}
			
			.qty {
				font-size: 12px;
				color: #909399;
				margin-top: 2px;
			}
		}
		
		.card-right {
			min-width: 70px;
		}
	}
}

.fab-container {
	position: fixed;
	bottom: 30px;
	right: 20px;
	width: 56px;
	height: 56px;
	background: linear-gradient(135deg, #2979ff, #609cff);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 6px 16px rgba(41, 121, 255, 0.4);
	z-index: 100;
	transition: transform 0.2s;
	
	&:active {
		transform: scale(0.95);
	}
}

.popup-content {
	padding: 20px;
	background-color: #ffffff;
	
	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		
		.title {
			font-size: 18px;
			font-weight: bold;
			color: #303133;
		}
	}
	
	.type-selector {
		display: flex;
		gap: 16px;
		margin-bottom: 24px;
		
		.type-item {
			flex: 1;
			background-color: #f5f7fa;
			padding: 12px;
			border-radius: 8px;
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 8px;
			font-weight: 500;
			color: #606266;
			border: 1px solid transparent;
			transition: all 0.2s;
			
			&.active {
				background-color: #ecf5ff;
				color: #2979ff;
				
				&.sell {
					background-color: #fef0f0;
					color: #f56c6c;
					border-color: #fde2e2;
				}
				
				&.buy {
					background-color: #f0f9eb;
					color: #19be6b;
					border-color: #e1f3d8;
				}
			}
		}
	}
	
	.input-row {
		display: flex;
		gap: 16px;
		
		.half-width {
			flex: 1;
		}
	}
	
	.btn-group {
		margin-top: 30px;
	}
}

.modal-content {
	padding: 10px 0;
	
	.trade-summary {
		display: flex;
		justify-content: space-around;
		background-color: #f9fafe;
		padding: 16px;
		border-radius: 8px;
		margin-bottom: 20px;
		
		.summary-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			
			.label {
				font-size: 12px;
				color: #909399;
				margin-bottom: 6px;
			}
			
			.value {
				font-size: 18px;
				font-weight: bold;
				color: #303133;
				
				&.highlight {
					color: #2979ff;
				}
			}
		}
	}
	
	.input-area {
		margin-bottom: 20px;
		
		.input-suffix {
			font-size: 14px;
			color: #909399;
			padding-left: 8px;
		}
	}
	
	.total-calc {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 12px;
		border-top: 1px solid #ebeef5;
		
		.label {
			font-size: 14px;
			color: #606266;
		}
		
		.amount {
			font-size: 18px;
			font-weight: bold;
			color: #f56c6c;
		}
	}
}
</style>
