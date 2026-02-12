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
				target: 'http://localhost:8889',
				changeOrigin: true,
				logLevel: 'debug',
				pathRewrite: {
					'^/api': '/api'
				}
			}
		}
	}
}
