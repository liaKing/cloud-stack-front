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
    /* uView 图标字体：优先本地，避免 H5 下 u-icon 只显示白块（CDN 未加载） */
    @font-face {
        font-family: 'uicon-iconfont';
        src: url('/static/fonts/uicon-iconfont.ttf') format('truetype'),
             url('https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf') format('truetype');
        font-display: block;
    }
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
    /* 全局消除 H5 白块：uView 按钮默认 width:100% + plain 白底会铺满产生白块 */
    .u-button,
    button.u-button,
    button[class*="u-button"],
    .u-reset-button {
        width: auto !important;
        max-width: 100% !important;
        position: relative !important;
        -webkit-appearance: none !important;
        appearance: none !important;
    }
    .u-button::before,
    button.u-button::before,
    button[class*="u-button"]::before {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
    }
    /* 图标组件及内层 span 强制透明，避免字体未加载时出现白块 */
    .u-icon,
    [class*="u-icon"],
    .u-icon__icon,
    [class*="u-icon__icon"] {
        background-color: transparent !important;
        background: transparent !important;
    }
    /* 卡片/列表项裁剪溢出，防止白块露出 */
    .stock-card,
    .order-card,
    .asset-card,
    .holding-card {
        overflow: hidden !important;
    }
    /* #endif */
</style>