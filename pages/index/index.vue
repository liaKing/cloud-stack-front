<template>
  <view class="container">
    <view class="header-card">
      <view class="title-box">
        <text class="title">官方市场</text>
        <view class="status-badge">
          <text class="status-dot"></text>
          <text>赛前申购阶段</text>
        </view>
      </view>
      <text class="subtitle">这里展示所有官方立项的项目，您可以直接申购原始股。</text>
    </view>
    
    <view class="stock-list">
      <view class="stock-card" v-for="(item, index) in list" :key="item.id || index" :class="{'disabled-card': item.status === 2}">
        <view class="card-header">
          <view class="header-left">
            <u-icon name="grid-fill" color="#2979ff" size="24"></u-icon>
            <text class="item-name">{{ item.name }}</text>
          </view>
          <u-tag :text="getStatusText(item.status)" :type="getStatusType(item.status)" shape="circle" size="mini"></u-tag>
        </view>
        
        <view class="card-body">
          <text class="item-desc">{{ item.description || '暂无项目描述' }}</text>
          
          <view class="data-grid">
            <view class="data-item">
              <text class="value price">{{ item.purchasePrice }}</text>
              <text class="label">进货价</text>
            </view>
            <view class="data-item">
              <text class="value">{{ item.totalValue }}</text>
              <text class="label">当前总值</text>
            </view>
            <view class="data-item">
              <text class="value">{{ item.totalQuantity }}</text>
              <text class="label">发行总量</text>
            </view>
          </view>
        </view>
        
        <view class="card-footer">
          <view class="valuation">
            估值: <text class="highlight">{{ (item.totalValue / (item.totalQuantity || 1)).toFixed(2) }}</text>
          </view>
          <view class="footer-btn">
            <u-button 
              v-if="item.status === 1" 
              type="primary" 
              text="立即申购" 
              size="small" 
              shape="circle"
              :custom-style="'padding: 0 20px; height: 32px;'"
              @click="openBuyModal(item)"
            ></u-button>
            <u-button 
              v-else 
              type="info" 
              text="停止申购" 
              size="small" 
              shape="circle" 
              disabled
              plain
            ></u-button>
          </view>
        </view>
      </view>
    </view>
    
    <u-empty v-if="list.length === 0" mode="data" text="暂无项目数据" style="margin-top: 50px;"></u-empty>
    
    <!-- Buy Modal -->
    <u-modal 
      :show="showBuyModal" 
      title="申购股票" 
      :showCancelButton="true" 
      @confirm="handleBuy" 
      @cancel="closeBuyModal"
    >
      <view class="modal-content">
        <view class="project-info">
          <view class="info-row">
            <text class="label">当前项目</text>
            <text class="val">{{ currentItem.name || '-' }}</text>
          </view>
          <view class="info-row">
            <text class="label">原始单价</text>
            <text class="val price">{{ currentItem.purchasePrice || 0 }} 幸运值</text>
          </view>
        </view>
        
        <view class="input-box">
          <u-input 
            v-model="buyQuantity" 
            placeholder="请输入购买数量" 
            type="number" 
            border="surround"
            clearable
            shape="circle"
          ></u-input>
        </view>
        
        <view class="summary-box" v-if="buyQuantity">
          <text>预计花费</text>
          <text class="total-price">{{ (Number(buyQuantity) * currentItem.purchasePrice).toFixed(0) }} 幸运值</text>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
import { getStockList, buyStock } from '@/api/stock.js';

export default {
  data() {
    return {
      list: [],
      timer: null,
      showBuyModal: false,
      currentItem: {},
      buyQuantity: '',
    }
  },
  onShow() {
    this.fetchList();
    this.startPolling();
  },
  onHide() {
    this.stopPolling();
    // 切到其他 tab 时关闭弹窗，避免“取消”按钮残留在其他页面
    this.showBuyModal = false;
  },
  onUnload() {
    this.stopPolling();
  },
  onPullDownRefresh() {
    this.fetchList().finally(() => {
      uni.stopPullDownRefresh();
    });
  },
  methods: {
    async fetchList() {
      try {
        const res = await getStockList();
        if (res.code === 0 && res.data) {
          this.list = res.data.list || [];
        }
      } catch (e) {
        console.error(e);
        uni.showToast({ title: '数据加载失败', icon: 'none' });
      }
    },
    startPolling() {
      this.stopPolling();
      this.timer = setInterval(() => {
        this.fetchList();
      }, 10000);
    },
    stopPolling() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    getStatusText(status) {
      const map = { 1: '立项中', 2: '已淘汰', 3: '游戏中', 4: '已结算' };
      return map[status] || '未知';
    },
    getStatusType(status) {
      if (status === 1) return 'success';
      if (status === 3) return 'warning';
      if (status === 2) return 'error';
      return 'info';
    },
    openBuyModal(item) {
      if (!item || !item.id) {
        uni.showToast({ title: '数据异常', icon: 'none' });
        return;
      }
      this.currentItem = item;
      this.buyQuantity = '';
      this.showBuyModal = true;
    },
    closeBuyModal() {
      this.showBuyModal = false;
    },
    async handleBuy() {
      if (!this.buyQuantity || this.buyQuantity <= 0) {
        uni.showToast({ title: '请输入有效数量', icon: 'none' });
        return;
      }
      
      try {
        const res = await buyStock({
          itemId: this.currentItem.id,
          quantity: Number(this.buyQuantity)
        });
        
        if (res.code === 0) {
          uni.showToast({ title: '申购成功', icon: 'success' });
          this.showBuyModal = false;
          this.fetchList();
          this.$store.dispatch('updateUserInfo');
        } else {
          uni.showToast({ title: (res.message || res.msg) || '申购失败', icon: 'none' });
        }
      } catch (e) {
        console.error(e);
        uni.showToast({ title: '网络错误，请稍后重试', icon: 'none' });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 16px;
  /* 移除复杂计算，使用安全边距 */
  /* #ifdef H5 */
  padding-top: 60px; 
  /* #endif */
  /* #ifndef H5 */
  padding-top: 16px;
  /* #endif */
  background-color: #f5f7fa;
  min-height: 100vh;
  width: 100%;
  
  /* 修改为 Flex 布局以解决宽度塌陷问题 */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .header-card {
    width: 100%;
    /* 确保 padding 不会撑破宽度 */
    box-sizing: border-box;
    padding: 20px;
    background: linear-gradient(135deg, #2979ff, #609cff);
    border-radius: 16px;
    margin-bottom: 20px;
    color: #fff;
    box-shadow: 0 4px 12px rgba(41, 121, 255, 0.3);
    /* 防止被压缩 */
    flex-shrink: 0;
    
    .title-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      
      .title {
        font-size: 22px;
        font-weight: 800;
        letter-spacing: 0.5px;
        color: #fff;
      }
      
      .status-badge {
        background-color: rgba(255, 255, 255, 0.2);
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 12px;
        display: flex;
        align-items: center;
        color: #fff;
        
        .status-dot {
          width: 6px;
          height: 6px;
          background-color: #19be6b;
          border-radius: 50%;
          margin-right: 6px;
        }
      }
    }
    
    .subtitle {
      font-size: 13px;
      opacity: 0.9;
      line-height: 1.4;
      color: #fff;
      display: block;
      margin-top: 8px;
    }
  }
  
  .stock-list {
    width: 100%;
    
    .stock-card {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      transition: all 0.2s;
      
      &.disabled-card {
        opacity: 0.7;
        background-color: #fafafa;
      }
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f0f2f5;
        
        .header-left {
          display: flex;
          align-items: center;
          /* gap: 8px; 移除兼容性差的 gap */
          
          .item-name {
            margin-left: 8px; /* 使用 margin 替代 */
            font-size: 16px;
            font-weight: bold;
            color: #303133;
          }
        }
      }
      
      .card-body {
        .item-desc {
          font-size: 13px;
          color: #909399;
          margin-bottom: 16px;
          display: block;
          line-height: 1.5;
        }
        
        .data-grid {
          display: flex;
          justify-content: space-between;
          background-color: #f9fafe;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          
          .data-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            /* 防止内容溢出 */
            min-width: 0;
            
            .label {
              font-size: 11px;
              color: #909399;
              margin-top: 4px;
            }
            
            .value {
              font-size: 15px;
              color: #303133;
              font-weight: 600;
              
              &.price {
                color: #2979ff;
              }
            }
          }
        }
      }
      
      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 40px;
        
        .valuation {
          flex: 1;
          min-width: 0;
          margin-right: 12px;
          font-size: 12px;
          color: #606266;
          
          .highlight {
            color: #ff9900;
            font-weight: bold;
            margin-left: 4px;
            font-size: 14px;
          }
        }
        
        .footer-btn {
          flex-shrink: 0;
          /* 覆盖 uView 默认 width:100%，避免白色按钮背景遮挡左侧估值 */
          .u-button {
            width: auto !important;
            min-width: 6px;
          }
        }
      }
    }
  }

  .modal-content {
    padding: 10px 0;
    
    .project-info {
      background-color: #f9fafe;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      
      .info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 14px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .label {
          color: #909399;
        }
        
        .val {
          font-weight: 500;
          color: #303133;
          
          &.price {
            color: #2979ff;
          }
        }
      }
    }
    
    .input-box {
      margin-bottom: 20px;
    }
    
    .summary-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      border-top: 1px dashed #e4e7ed;
      font-size: 14px;
      
      .total-price {
        color: #f56c6c;
        font-weight: bold;
        font-size: 16px;
      }
    }
  }
}
</style>