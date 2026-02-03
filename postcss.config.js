module.exports = {
	plugins: [
		require('autoprefixer')({
			remove: false
		}),
		{
			postcssPlugin: 'postcss-rpx-to-vw',
			Declaration(decl) {
				if (decl.value.includes('rpx')) {
					decl.value = decl.value.replace(/(\d+(\.\d+)?)rpx/g, (match, number) => {
						// 750rpx = 100vw
						const vw = (parseFloat(number) / 750) * 100;
						return `${vw.toFixed(5)}vw`;
					});
				}
			}
		}
	]
}
