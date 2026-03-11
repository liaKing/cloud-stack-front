/**
 * 接口基础地址配置
 *
 * 开发环境：使用 /api 前缀，由 vue.config.js devServer 代理到远程服务器，避免跨域
 * 生产环境：前端和后端部署在同一台服务器上，直接用本机地址，不跨域
 */
// 开发/生产均使用 /api 前缀
// 开发环境：vue.config.js devServer 代理到 localhost:8889
// 生产环境：nginx 反向代理 /api → localhost:8889
const BASE_URL = '/api'


export default {
  BASE_URL
}
