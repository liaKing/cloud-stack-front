<script>
	export default {
		onLaunch: function() {
			// #ifdef MP-WEIXIN
			uni.hideShareMenu({
				menus: ['shareAppMessage', 'shareTimeline']
			})
			// #endif
			
			// Check login status
			const token = uni.getStorageSync('token');
			if (!token) {
				// Use reLaunch to clear page stack and go to login
				// Need to use setTimeout to ensure router is ready in some environments
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/login/index'
					});
				}, 100);
			}
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	
	/* 全局基础样式 */
	:root {
		--status-bar-height: 25px;
	}

	page {
		background-color: #f5f7fa;
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
	}
	
	/* 移除全局 box-sizing: border-box，避免污染 uni-ui 组件（如 tabbar） */
	/* 建议在各页面组件中按需添加 */
	
    /* #ifdef H5 */
    /* 修复 H5 端 Tabbar 样式异常 - 占据整行平均铺开（框架实际类名为 uni-tabbar__item） */
    uni-tabbar {
        width: 100% !important;
        box-sizing: border-box !important;
    }
    uni-tabbar .uni-tabbar {
        display: flex !important;
        flex-direction: row !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }
    /* 框架使用 .uni-tabbar__item（双下划线），不是 .uni-tabbar-item */
    uni-tabbar .uni-tabbar__item {
        flex: 1 1 0% !important;
        min-width: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
    }
    uni-tabbar .uni-tabbar__icon {
        width: 24px !important;
        height: 24px !important;
    }
    uni-tabbar .uni-tabbar__icon img {
        width: 100% !important;
        height: 100% !important;
    }
    /* #endif */
</style>