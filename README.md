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

## 持续集成

GitHub Actions 工作流位于 `.github/workflows/ci.yml`。它会在每次推送、Pull Request 和手动触发时运行，并分别在当前受支持的 Node.js 22、24、26 版本上执行 `npm run check` 和 `npm test`。一个版本失败时，其余版本仍会继续运行；同一分支有新提交时，旧的运行会被取消。

目前不启用 npm 缓存，也不安装依赖：项目没有第三方 npm 包或锁文件，因此没有可复用的下载缓存。将来加入依赖时，应先提交 `package-lock.json`，再改用 `npm ci` 并通过 `actions/setup-node` 按锁文件缓存 npm 下载。

### CI 失败排查

1. 在 GitHub 打开 **Actions**，进入失败的 CI 运行和对应的 Node.js 版本任务，展开第一个红色步骤查看错误。
2. 若 `npm run check` 失败，按日志中的文件和行号修复语法错误，然后在本地重新运行 `npm run check`。
3. 若 `npm test` 失败，检查日志指出的失败用例和堆栈，并在本地运行 `npm test` 复现。
4. 若没有启动运行，确认仓库设置允许 GitHub Actions，并检查提交或 PR 所在分支中是否包含 `.github/workflows/ci.yml`。

## 文件用途

| 文件 | 用途 |
| --- | --- |
| `.github/workflows/ci.yml` | 在受支持的 Node.js 版本上运行语法检查和测试。 |
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
├── .github/
│   └── workflows/
│       └── ci.yml
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
