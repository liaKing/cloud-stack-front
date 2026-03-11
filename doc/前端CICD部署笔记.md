# 云股东前端 CI/CD 部署笔记

---

## 一、项目技术栈

- **框架**：UniApp（Vue 2）+ uview-ui
- **构建工具**：vue-cli-service
- **目标平台**：H5
- **构建产物路径**：`dist/build/h5/`

---

## 二、服务器环境

- **系统**：OpenCloudOS 9.4（腾讯云，基于 RHEL）
- **公网 IP**：`175.178.83.155`
- **面板**：宝塔面板（BT Panel）
- **后端**：Go（Gin）进程，监听 `:8889`
- **前端静态文件目录**：`/var/www/cloud-stock/`

### 关键路径

| 用途 | 路径 |
|---|---|
| 宝塔 Nginx 二进制 | `/usr/local/nginx/sbin/nginx` |
| 宝塔 Nginx 主配置 | `/usr/local/nginx/conf/nginx.conf` |
| 前端站点配置 | `/www/server/panel/vhost/nginx/cloud-stock.conf` |
| 前端静态文件 | `/var/www/cloud-stock/` |
| 后端程序目录 | `/opt/stock/` |

---

## 三、Nginx 配置

### 站点配置 `/www/server/panel/vhost/nginx/cloud-stock.conf`

```nginx
server {
    listen 80 default_server;
    root /var/www/cloud-stock;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 反向代理后端 API
    location /api/ {
        proxy_pass http://localhost:8889/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 宝塔 Nginx 主配置引入站点

```nginx
# /usr/local/nginx/conf/nginx.conf http 块内加了这一行
include /www/server/panel/vhost/nginx/cloud-stock.conf;
```

### 常用 Nginx 命令（必须用宝塔的，不是 /usr/bin/nginx）

```bash
/usr/local/nginx/sbin/nginx -t        # 验证配置
/usr/local/nginx/sbin/nginx -s reload # 重载配置
```

### 重要说明：服务器上有两套 Nginx

| | 系统 Nginx | 宝塔 Nginx |
|---|---|---|
| 路径 | `/usr/bin/nginx` | `/usr/local/nginx/sbin/nginx` |
| 实际监听 80 端口 | ❌ | ✅ |
| 配置文件 | `/www/server/nginx/conf/` | `/usr/local/nginx/conf/` |

系统 Nginx 是用 `yum install nginx` 装的，实际没有使用，所有操作要针对宝塔 Nginx。

### default_server 说明

`default_server` 用于指定当请求不匹配任何 `server_name` 时由哪个 server 块处理。由于没有域名，直接用 IP 访问时请求没有域名信息，必须设置 `default_server` 才能正确路由到前端站点。

---

## 四、整体运行架构

```
浏览器访问 http://175.178.83.155
        ↓
宝塔 Nginx（/usr/local/nginx/sbin/nginx）
        ├── GET /           → 返回 /var/www/cloud-stock/index.html
        ├── GET /static/    → 返回 /var/www/cloud-stock/static/ 下的 JS/CSS
        └── GET /api/xxx    → 转发到 Go 后端 localhost:8889
                                    ↓
                              Go 进程（stock-server）
                                    ↓
                              PostgreSQL / Redis
```

---

## 五、CI/CD 流程（GitHub Actions）

### 工作流文件 `.github/workflows/deploy.yml`

```
push 到 main 分支
        ↓
GitHub Actions Runner（ubuntu-latest）
        ├── actions/checkout@v4         检出代码
        ├── actions/setup-node@v4       安装 Node 16
        ├── npm ci --legacy-peer-deps   安装依赖（自动执行 patch-package 打补丁）
        ├── npm run build:h5            编译生成 dist/build/h5/
        ├── appleboy/scp-action         推送静态文件到服务器
        └── appleboy/ssh-action         验证 index.html 存在并重载 Nginx
```

### 需要配置的 GitHub Secrets

| Secret | 值 |
|---|---|
| `SSH_HOST` | `175.178.83.155` |
| `SSH_USER` | `root` |
| `SSH_PRIVATE_KEY` | 服务器 SSH 私钥 |
| `FRONT_DEPLOY_PATH` | `/var/www/cloud-stock` |

### 与后端 CI/CD 的对比

| | 后端 | 前端 |
|---|---|---|
| 编译在哪里 | 服务器本地 `go build` | GitHub Actions Runner |
| 部署方式 | git pull + 重启进程 | scp 推静态文件 |
| 部署后操作 | 重启 Go 进程 | 无需操作，Nginx 自动生效 |
| 服务器需要什么 | Go 环境 | 只需要 Nginx |

---

## 六、依赖问题修复记录

### 问题：`recyclableRender` / `components` 未定义

**原因**：`@dcloudio/vue-cli-plugin-uni` 的 `templateLoader.js` 在 export 语句中无条件导出 `recyclableRender` 和 `components`，但模板编译器并不总是生成这两个变量，导致构建报错：

```
Module parse failed: Export 'recyclableRender' is not defined
```

**修复方式**：使用 `patch-package` 对 `templateLoader.js` 打补丁，条件判断后再导出：

```js
const hasRecyclableRender = code.indexOf('var recyclableRender') !== -1
const hasComponents = code.indexOf('var components') !== -1
const extras = [
  hasRecyclableRender ? 'recyclableRender' : null,
  hasComponents ? 'components' : null,
].filter(Boolean).join(', ')
return code + `\nexport { render, staticRenderFns${extras ? ', ' + extras : ''} }`
```

**补丁文件**：`patches/@dcloudio+vue-cli-plugin-uni+2.0.2-3090920231225001.patch`

`package.json` 中配置 postinstall 钩子，每次安装依赖后自动应用补丁：

```json
"scripts": {
  "postinstall": "patch-package"
}
```

### @dcloudio 版本固定

所有 `@dcloudio/*` 包固定到 `2.0.2-3090920231225001`（2023年12月），避免 `latest` 版本漂移导致构建不稳定。

---

## 七、Node.js 版本说明

CI 中固定使用 **Node 16**，原因：

- Vue 2 + `@vue/cli-service ~5.x` 在 Node 18/20 下会出现 OpenSSL 报错：
  ```
  Error: error:0308010C:digital envelope routines::unsupported
  ```
- Node 16 是该项目的最稳定运行版本
