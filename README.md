# 崮生mcp工具箱

[English README](README.en.md) | 中文说明

一个基于 Model Context Protocol (MCP) 的图像分析工具，使用智谱 GLM-4.5V 模型进行图像识别和分析。

## 功能特性

- 🖼️ 支持多种图像格式（PNG、JPG、JPEG、GIF）
- 🤖 集成智谱 GLM-4.5V 模型进行图像分析
- 🔧 环境变量灵活配置，支持多级查找
- 🚀 轻量级，易于集成和部署

## 安装

```bash
pnpm install
```

## 配置

### API Key 设置

本项目支持多种方式设置 GLM API Key，按优先级顺序：

1. **系统环境变量**（推荐）
   ```bash
   export GLM_API_KEY=your_api_key_here
   ```

2. **执行目录下的 .env 文件**
   在运行命令的目录下创建 `.env` 文件：
   ```
   GLM_API_KEY=your_api_key_here
   ```

3. **项目目录下的 .env 文件**
   在项目根目录下创建 `.env` 文件

### 获取 API Key

请访问 [智谱AI开放平台](https://open.bigmodel.cn/) 获取你的 API Key。

## 使用方法

### 开发模式

```bash
pnpm dev
```

### 构建

```bash
pnpm build
```

### 运行

```bash
pnpm start
```

### 作为 MCP 工具使用

构建完成后，可以作为 MCP 工具在其他应用中使用：

```bash
./build/index.js
```

## API 参考

### read_image 工具

分析图像内容。

**参数：**
- `image_path` (string): 图像文件路径
- `prompt` (string): 分析提示文本

**示例：**
```json
{
  "image_path": "/path/to/image.png",
  "prompt": "请描述这张图片中的主要内容"
}
```

## 许可证

ISC

## 贡献

欢迎提交 Issue 和 Pull Request！

