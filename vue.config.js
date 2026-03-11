module.exports = {
	transpileDependencies: ['uview-ui'],
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
				target: 'http://175.178.83.155:8889',
				changeOrigin: true,
				logLevel: 'debug',
				pathRewrite: {
					'^/api': ''
				}
			}
		}
	}
}
