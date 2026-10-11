# Fly

一个零依赖的 Node.js 静态 Web 项目起点。它自带本地 HTTP 服务器、健康检查接口和自动化测试，无需构建工具或第三方 npm 包。

## 环境要求

- Node.js 18 或更高版本
- npm（随 Node.js 一起安装）

## 启动

```bash
npm start
```

浏览器打开 <http://127.0.0.1:4173>。要更换端口，可设置 `PORT`；要更改监听地址，可设置 `HOST`。例如：

```bash
PORT=8080 npm start
```

PowerShell：

```powershell
$env:PORT = "8080"
npm start
```

健康检查地址：<http://127.0.0.1:4173/health>，成功时返回 `{"status":"ok","project":"fly"}`。

## 验证

```bash
npm run check
npm test
```

`check` 使用 Node.js 检查 JavaScript 语法；`test` 使用 Node.js 自带的测试运行器，验证首页、健康检查、未知路径、路径穿越防护和不支持的 HTTP 方法。整个项目没有第三方依赖，不需要运行 `npm install`。

## 文件用途

| 文件 | 用途 |
| --- | --- |
| `package.json` | 项目元数据、Node.js 版本要求和启动/检查/测试命令。 |
| `.gitignore` | 忽略依赖目录、环境文件、日志和操作系统临时文件。 |
| `.editorconfig` | 统一常见编辑器的缩进、换行和字符编码。 |
| `src/server.mjs` | 零依赖 HTTP 服务器，提供静态文件和 `/health` 接口。 |
| `public/index.html` | 项目首页和语义化页面结构。 |
| `public/styles.css` | 响应式页面样式，支持减少动态效果的系统偏好。 |
| `public/app.js` | 页面交互和服务器健康状态检查。 |
| `test/server.test.mjs` | 基于 Node.js 内置测试工具的 HTTP 集成测试。 |

## 项目结构

```text
fly/
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── src/
│   └── server.mjs
├── test/
│   └── server.test.mjs
├── .editorconfig
├── .gitignore
├── package.json
└── README.md
```

