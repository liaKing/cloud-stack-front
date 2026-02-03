module.exports = {
	publicPath: './',
	css: {
		loaderOptions: {
			scss: {
				implementation: require('sass'),
				prependData: `@import "@/uni.scss";`,
				sassOptions: {
					fiber: false
				}
			}
		}
	},
	devServer: {
		proxy: {
			'/api': {
				target: 'http://47.98.124.41:8889',
				changeOrigin: true,
				logLevel: 'debug',
				pathRewrite: {
					'^/api': '/api'
				}
			}
		}
	}
}
