# 崮生mcp工具箱

[English README](README.en.md) | 中文说明

一个基于 Model Context Protocol (MCP) 的多模态 AI 工具箱，集成了智谱 GLM 、阿里云 Qwen 、 Pollinations.AI 两大平台的强大能力。

## 🚀 功能特性

### Bigmodel (智谱 GLM)
- 🖼️ **图片分析** - 使用 GLM-4.5V 模型进行图像识别和分析
- 🎬 **视频分析** - 支持视频内容分析和理解
- 🎨 **图片生成** - 使用 CogView-4 系列模型生成高质量图片

### Pollinations.AI
- 🖼️ **图片生成** - 支持多种模型和参数配置
- 📝 **文本生成** - 智能文本生成和对话
- 🔊 **音频生成** - 文字转语音，支持多种声音
- 👁️ **图片分析** - OpenAI 兼容的视觉分析能力

### 阿里百炼 Qwen
- 📝 **文本生成** - 使用Qwen系列模型进行文本生成
- 🖼️ **图片分析** - 使用Qwen-VL系列模型进行图像分析
- 🎬 **视频分析** - 使用Qwen-VL系列模型进行视频分析

### 通用特性
- 🔧 灵活的环境变量配置
- 📝 完整的日志记录系统
- 🚀 轻量级，易于集成和部署
- 🛡️ TypeScript 类型安全

## 📦 安装

```bash
pnpm install
```

## ⚙️ 配置

### API Key 设置

#### 智谱 GLM API Key
访问 [智谱AI开放平台](https://open.bigmodel.cn/) 获取 API Key：

```bash
export GLM_API_KEY=your_glm_api_key_here
```

#### 阿里云 Qwen API Key
访问 [阿里云DashScope平台](https://dashscope.console.aliyun.com/) 获取 API Key：

```bash
export ALIYUN_API_KEY=your_aliyun_api_key_here
```

#### 模型配置（可选）
```bash
# GLM 模型配置
GLM_IMAGE_MODEL=glm-4.5v
GLM_VIDEO_MODEL=glm-4.5v
GLM_GENERATION_MODEL=cogview-3-flash

# Qwen 模型配置
GLM_QWEN_MODEL=qwen-vl-max
```

### 环境变量优先级
1. 系统环境变量（推荐）
2. 执行目录下的 `.env` 文件
3. 项目根目录下的 `.env` 文件

## 🛠️ 使用方法

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
```bash
{
  "mcpServers": {
    "vl-mcp": {
      "command": "node",
      "args": [
        "$HOME/vlm-mcp/build/index.js"
      ],
      "env": {
        "ALIYUN_API_KEY": "sk-XXXXXXXXXXXXXXX"
      }
    }
  }
}
```

## 📚 工具参考

### Bigmodel 工具

#### read_image - 图片分析
**参数：**
- `image_path` (string): 图片文件路径
- `prompt` (string): 分析提示文本
- `temperature` (number, 可选): 采样温度 (0.0-1.0)
- `top_p` (number, 可选): 采样参数 (0.0-1.0)
- `max_tokens` (number, 可选): 最大输出令牌数

**示例：**
```json
{
  "image_path": "/path/to/image.jpg",
  "prompt": "请详细描述这张图片的内容"
}
```

#### analyze_video - 视频分析
**参数：**
- `video_url` (string): 视频文件 URL
- `prompt` (string): 分析提示文本
- `temperature` (number, 可选): 采样温度 (0.0-1.0)
- `top_p` (number, 可选): 采样参数 (0.0-1.0)
- `max_tokens` (number, 可选): 最大输出令牌数

**示例：**
```json
{
  "video_url": "https://example.com/video.mp4",
  "prompt": "分析这个视频的主要内容"
}
```

#### generate_image - 图片生成
**参数：**
- `prompt` (string): 图片描述文本
- `quality` (string, 可选): 图片质量 (hd/standard)
- `size` (string, 可选): 图片尺寸
- `save_path` (string, 可选): 图片保存路径

**示例：**
```json
{
  "prompt": "一只可爱的小猫咪，卡通风格",
  "quality": "standard",
  "size": "1024x1024",
  "save_path": "./cat.png"
}
```

### Pollinations.AI 工具

#### pollinations_generate_image - 图片生成
**参数：**
- `prompt` (string): 图片描述文本
- `model` (string, 可选): 生成模型 (默认: flux)
- `width` (number, 可选): 图片宽度 (64-2048)
- `height` (number, 可选): 图片高度 (64-2048)
- `seed` (number, 可选): 随机种子
- `nologo` (boolean, 可选): 禁用 logo
- `private` (boolean, 可选): 私有生成
- `enhance` (boolean, 可选): 增强提示词
- `safe` (boolean, 可选): 安全过滤
- `transparent` (boolean, 可选): 透明背景

**示例：**
```json
{
  "prompt": "A beautiful landscape with mountains",
  "model": "flux",
  "width": 1024,
  "height": 768
}
```

#### pollinations_generate_text - 文本生成
**参数：**
- `prompt` (string): 文本提示
- `model` (string, 可选): 生成模型 (默认: openai)
- `temperature` (number, 可选): 随机性 (0.0-3.0)
- `top_p` (number, 可选): 核心采样 (0.0-1.0)
- `json` (boolean, 可选): JSON 格式输出
- `system` (string, 可选): 系统提示词
- `stream` (boolean, 可选): 流式输出

**示例：**
```json
{
  "prompt": "写一首关于春天的诗",
  "model": "openai",
  "temperature": 0.8
}
```

#### pollinations_generate_audio - 音频生成
**参数：**
- `prompt` (string): 要转换的文本
- `voice` (string, 可选): 声音选择 (alloy/echo/fable/onyx/nova/shimmer)
- `model` (string, 可选): 音频模型 (默认: openai-audio)

**示例：**
```json
{
  "prompt": "你好，欢迎使用我们的服务！",
  "voice": "nova"
}
```

#### pollinations_analyze_image - 图片分析
**参数：**
- `image_path` (string, 可选): 本地图片路径
- `image_url` (string, 可选): 图片 URL
- `prompt` (string): 分析提示文本
- `model` (string, 可选): 分析模型 (默认: openai)
- `max_tokens` (number, 可选): 最大输出令牌数

**示例：**
```json
{
  "image_path": "/path/to/image.jpg",
  "prompt": "What's in this image?",
  "model": "openai"
}
```

### 阿里百炼 Qwen 工具

#### qwen_generate_text - 文本生成
**参数：**
- `prompt` (string): 文本提示
- `model` (string, 可选): 生成模型 (默认: qwen-max)
- `temperature` (number, 可选): 随机性 (0.0-1.0)
- `top_p` (number, 可选): 核心采样 (0.0-1.0)
- `max_tokens` (number, 可选): 最大输出令牌数
- `system` (string, 可选): 系统提示词

**示例：**
```json
{
  "prompt": "写一首关于春天的诗",
  "model": "qwen-max",
  "temperature": 0.8
}
```

#### qwen_analyze_image - 图片分析
**参数：**
- `image_path` (string, 可选): 本地图片路径
- `image_url` (string, 可选): 图片 URL
- `prompt` (string): 分析提示文本
- `model` (string, 可选): 分析模型 (默认: qwen-vl-max)
- `temperature` (number, 可选): 随机性 (0.0-1.0)
- `top_p` (number, 可选): 核心采样 (0.0-1.0)
- `max_tokens` (number, 可选): 最大输出令牌数

**示例：**
```json
{
  "image_path": "/path/to/image.png",
  "prompt": "请详细描述这张图片的内容",
  "model": "qwen-vl-max"
}
```

#### qwen_analyze_video - 视频分析
**参数：**
- `video_url` (string): 视频 URL
- `prompt` (string): 分析提示文本
- `model` (string, 可选): 分析模型 (默认: qwen-vl-max)
- `temperature` (number, 可选): 随机性 (0.0-1.0)
- `top_p` (number, 可选): 核心采样 (0.0-1.0)
- `max_tokens` (number, 可选): 最大输出令牌数

**示例：**
```json
{
  "video_url": "https://example.com/video.mp4",
  "prompt": "分析这个视频的主要内容",
  "model": "qwen-vl-max"
}
```

## 📝 日志系统

项目包含完整的日志记录系统，所有工具调用都会记录到项目根目录的 `mcpserver.log` 文件中：

- **INFO**: 工具调用和成功操作
- **ERROR**: 错误和异常信息
- **DEBUG**: 详细调试信息
- **WARN**: 警告信息

## 🔍 项目结构

```
src/
├── config/
│   ├── index.ts              # GLM 配置
│   ├── pollinations.ts       # Pollinations 配置
│   └── qwen.ts              # 阿里百炼 Qwen 配置
├── tools/
│   ├── bigmodel/             # 智谱 GLM 工具
│   │   ├── image-analysis.ts
│   │   ├── video-analysis.ts
│   │   └── image-generation.ts
│   ├── pollinations/         # Pollinations.AI 工具
│   │   ├── image-generation.ts
│   │   ├── text-generation.ts
│   │   ├── audio-generation.ts
│   │   └── image-analysis.ts
│   └── qwen/                # 阿里百炼 Qwen 工具
│       ├── text-generation.ts
│       ├── image-analysis.ts
│       └── video-analysis.ts
├── utils/
│   ├── helpers.ts           # 通用助手函数
│   ├── common.ts            # 通用响应函数
│   └── logger.ts            # 日志系统
└── index.ts                 # 主服务器入口
```

## 📄 许可证

ISC

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请创建 Issue 或联系维护者。
