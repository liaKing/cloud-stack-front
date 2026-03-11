/**
 * 接口基础地址配置
 *
 * 开发环境：使用 /api 前缀，由 vue.config.js devServer 代理到远程服务器，避免跨域
 * 生产环境：前端和后端部署在同一台服务器上，直接用本机地址，不跨域
 */
const BASE_URL = process.env.NODE_ENV === 'development'
  ? '/api'
  : 'http://175.178.83.155:8889'

export default {
  BASE_URL
}
