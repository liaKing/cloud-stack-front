# cloud-stock-front（云股东）

uni-app（Vue 2）前端项目。Mac 下按下面步骤即可运行。

---

## 一、准备环境（只需做一次）

### 1. 安装 Node.js（Mac）

终端执行：

```bash
brew install node
```

装好后执行 `node -v`、`npm -v` 能输出版本即表示成功。

若未安装 Homebrew，先执行：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. 安装项目依赖

在项目根目录执行：

```bash
cd /path/to/cloud-stock-front
npm install
```

（将 `/path/to/taoquan` 换成你的项目实际路径；网络慢可先执行 `npm config set registry https://registry.npmmirror.com`）

---

## 二、运行项目

```bash
npm run dev:h5
```

浏览器会打开或按终端提示访问（一般为 `http://localhost:8080`），改代码会自动刷新。

| 命令 | 说明 |
|------|------|
| `npm run dev:h5` | 开发运行（浏览器） |
| `npm run build:h5` | 打包 H5（输出在 `unpackage/dist/build/h5`） |
| `npm run dev:mp-weixin` | 编译微信小程序 |
| `npm run build:mp-weixin` | 打包微信小程序 |

---

## 三、常见问题

- **端口被占用**：在 `vue.config.js` 里改 `devServer.port`，或关掉占用该端口的程序。
- **接口 404**：`/api` 已代理到 `http://47.98.124.41:8889`，需保证后端可访问；改地址请编辑 `vue.config.js` 中 `devServer.proxy['/api'].target`。
- **sass 报错**：可尝试 `npm rebuild` 或删掉 `node_modules` 后重新 `npm install`。
- **Node 兼容**：若报错可尝试 Node 18 LTS：`brew install node@18`。

---

## 四、项目结构简要

- `pages/`：页面（index、login、mine、official-stock 等）
- `App.vue`、`main.js`：应用入口
- `pages.json`：页面路由与 tabBar
- `manifest.json`：应用配置（AppID、名称等）
- `vue.config.js`：开发服务器与代理
- `utils/api.js`：接口封装
