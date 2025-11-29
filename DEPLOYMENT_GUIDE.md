# ADHD音乐生成器部署指南

## 项目结构

```
ADHD音乐生成器/
├── music_library/          # 音乐文件目录
├── scene.html              # 场景模式页面
├── imitate.html            # 模仿模式页面
├── professional.html       # 专业模式页面
├── index.html              # 主页面
├── admin.html              # 管理页面
├── server.js               # 后端服务器
├── package.json            # 项目配置和依赖
└── DEPLOYMENT_GUIDE.md     # 部署指南（本文件）
```

## 部署方案

### 方案1：使用 Vercel 部署（推荐）

Vercel 是一个适合部署前端项目的平台，支持 Node.js 后端。

#### 步骤1：准备部署文件

1. 创建 `.vercelignore` 文件，排除不必要的文件：

```
music_library/
node_modules/
*.md
```

2. 创建 `vercel.json` 配置文件：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

#### 步骤2：部署到 Vercel

1. 访问 [Vercel 官网](https://vercel.com/) 并登录
2. 点击 "New Project"，选择你的项目仓库
3. 配置部署选项：
   - Framework Preset: Node.js
   - Build Command: `npm install`
   - Output Directory: 留空
4. 点击 "Deploy" 开始部署

### 方案2：使用 Netlify 部署

Netlify 适合部署静态网站，后端可以使用 Netlify Functions。

#### 步骤1：准备部署文件

1. 创建 `netlify.toml` 配置文件：

```toml
[build]
  command = "npm install"
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. 将后端代码迁移到 Netlify Functions：
   - 创建 `netlify/functions/server.js` 文件
   - 重写后端逻辑以适应 Netlify Functions 格式

#### 步骤2：部署到 Netlify

1. 访问 [Netlify 官网](https://www.netlify.com/) 并登录
2. 点击 "Add new site"，选择你的项目仓库
3. 配置部署选项：
   - Build command: `npm install`
   - Publish directory: `.`
4. 点击 "Deploy site" 开始部署

### 方案3：使用 Docker 部署

使用 Docker 可以将项目部署到任何支持 Docker 的服务器上。

#### 步骤1：创建 Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

#### 步骤2：创建 docker-compose.yml

```yaml
version: '3'

services:
  adhd-music:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./music_library:/app/music_library
    restart: unless-stopped
```

#### 步骤3：部署

1. 安装 Docker 和 Docker Compose
2. 运行 `docker-compose up -d` 启动服务
3. 访问 `http://localhost:3000` 查看部署结果

### 方案4：使用传统服务器部署

适合有自己服务器的用户。

#### 步骤1：准备服务器

1. 安装 Node.js 20+ 和 npm
2. 安装 PM2 进程管理器：`npm install -g pm2`
3. 配置防火墙，开放 3000 端口

#### 步骤2：部署项目

1. 将项目文件上传到服务器
2. 安装依赖：`npm install --production`
3. 使用 PM2 启动服务：`pm2 start server.js --name adhd-music`
4. 设置 PM2 开机自启：`pm2 startup`
5. 保存 PM2 配置：`pm2 save`

## 环境变量配置

如果需要配置环境变量，可以在 `.env` 文件中添加：

```
PORT=3000
NODE_ENV=production
```

## 域名配置

1. 在域名提供商处添加 A 记录，指向服务器 IP
2. 配置 Nginx 或 Apache 作为反向代理（可选）

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 部署后测试

1. 访问 `http://your-domain.com` 或 `http://localhost:3000`
2. 测试各模式的音乐生成功能
3. 测试音乐播放功能
4. 测试用户认证功能

## 维护和更新

1. 定期备份 `music_library` 目录
2. 定期更新依赖：`npm update --production`
3. 查看日志：`pm2 logs adhd-music`（如果使用 PM2）
4. 重启服务：`pm2 restart adhd-music`（如果使用 PM2）

## 注意事项

1. 确保 `music_library` 目录有适当的读写权限
2. 部署前测试所有功能是否正常
3. 考虑使用 HTTPS 加密传输
4. 对于高流量网站，考虑使用 CDN 加速静态资源
5. 定期监控服务器性能和日志

## 故障排除

### 问题1：服务器无法启动

- 检查端口是否被占用：`lsof -i :3000`
- 查看错误日志：`node server.js`
- 检查依赖是否正确安装：`npm install`

### 问题2：音乐无法播放

- 检查音乐文件路径是否正确
- 检查 `music_library` 目录权限
- 检查浏览器控制台是否有错误

### 问题3：生成按钮无响应

- 检查浏览器控制台是否有 JavaScript 错误
- 检查网络连接
- 检查服务器是否正常运行

## 联系方式

如果遇到部署问题，可以通过以下方式寻求帮助：

- 查看项目文档
- 检查服务器日志
- 联系项目维护者

---

部署完成后，ADHD音乐生成器将可以在线访问，用户可以通过浏览器使用所有功能。