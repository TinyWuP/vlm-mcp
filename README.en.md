# Gusheng MCP Toolbox

[中文说明](README.md) | English README

A Model Context Protocol (MCP) based multimodal AI toolbox that integrates Zhipu GLM, Pollinations.AI, and Alibaba Qwen platforms.

## Features

### Zhipu GLM
- 🖼️ **Image Analysis** - Using GLM-4.5V model for image recognition and analysis
- 🎬 **Video Analysis** - Support for video content analysis and understanding
- 🎨 **Image Generation** - Using CogView-4 series models to generate high-quality images

### Pollinations.AI
- 🖼️ **Image Generation** - Support for multiple models and parameter configurations
- 📝 **Text Generation** - Intelligent text generation and conversation
- 🔊 **Audio Generation** - Text-to-speech with multiple voice options
- 👁️ **Image Analysis** - OpenAI compatible vision analysis capabilities

### Alibaba Qwen
- 📝 **Text Generation** - Using Qwen series models for text generation
- 🖼️ **Image Analysis** - Using Qwen-VL series models for image analysis
- 🎬 **Video Analysis** - Using Qwen-VL series models for video analysis

### General Features
- 🔧 Flexible environment variable configuration with multi-level lookup
- 📝 Complete logging system
- 🚀 Lightweight, easy to integrate and deploy
- 🛡️ TypeScript type safety

## Installation

```bash
pnpm install
```

## Configuration

### API Key Setup

#### Zhipu GLM API Key
This project supports multiple ways to set GLM API Key, in priority order:

1. **System Environment Variables** (Recommended)
   ```bash
   export GLM_API_KEY=your_api_key_here
   ```

2. **.env file in execution directory**
   Create `.env` file in the directory where you run the command:
   ```
   GLM_API_KEY=your_api_key_here
   ```

3. **.env file in project directory**
   Create `.env` file in the project root directory

#### Alibaba Qwen API Key
To use Alibaba Qwen models, you need to set the Alibaba Cloud API Key:

```bash
export ALIYUN_API_KEY=your_aliyun_api_key_here
```

### Getting API Keys

- For Zhipu GLM: Please visit [Zhipu AI Open Platform](https://open.bigmodel.cn/) to get your API Key.
- For Alibaba Qwen: Please visit [Alibaba Cloud DashScope Platform](https://dashscope.console.aliyun.com/) to get your API Key.

## Usage

### Development Mode

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Run

```bash
pnpm start
```

### Use as MCP Tool

After building, you can use it as an MCP tool in other applications:

```bash
./build/index.js
```

## API Reference

### Zhipu GLM Tools

#### read_image tool

Analyze image content using GLM-4.5V model.

**Parameters:**
- `image_path` (string): Path to the image file
- `prompt` (string): Analysis prompt text
- `temperature` (number, optional): Sampling temperature (0.0-1.0)
- `top_p` (number, optional): Top-p sampling parameter (0.0-1.0)
- `max_tokens` (number, optional): Maximum output tokens

**Example:**
```json
{
  "image_path": "/path/to/image.png",
  "prompt": "Please describe the main content in this image"
}
```

#### analyze_video tool

Analyze video content using GLM-4.5V model.

**Parameters:**
- `video_url` (string): URL of the video file
- `prompt` (string): Analysis prompt text
- `temperature` (number, optional): Sampling temperature (0.0-1.0)
- `top_p` (number, optional): Top-p sampling parameter (0.0-1.0)
- `max_tokens` (number, optional): Maximum output tokens

**Example:**
```json
{
  "video_url": "https://example.com/video.mp4",
  "prompt": "Analyze the main content of this video"
}
```

#### generate_image tool

Generate images using CogView models.

**Parameters:**
- `prompt` (string): Image description text
- `quality` (string, optional): Image quality (hd/standard)
- `size` (string, optional): Image size
- `save_path` (string, optional): Image save path

**Example:**
```json
{
  "prompt": "A cute cartoon cat",
  "quality": "standard",
  "size": "1024x1024",
  "save_path": "./cat.png"
}
```

### Pollinations.AI Tools

#### pollinations_generate_image tool

Generate images using various models.

**Parameters:**
- `prompt` (string): Image description text
- `model` (string, optional): Generation model (default: flux)
- `width` (number, optional): Image width (64-2048)
- `height` (number, optional): Image height (64-2048)
- `seed` (number, optional): Random seed
- `nologo` (boolean, optional): Disable logo
- `private` (boolean, optional): Private generation
- `enhance` (boolean, optional): Enhance prompt
- `safe` (boolean, optional): Safety filter
- `transparent` (boolean, optional): Transparent background

**Example:**
```json
{
  "prompt": "A beautiful landscape with mountains",
  "model": "flux",
  "width": 1024,
  "height": 768
}
```

#### pollinations_generate_text tool

Generate text using various models.

**Parameters:**
- `prompt` (string): Text prompt
- `model` (string, optional): Generation model (default: openai)
- `temperature` (number, optional): Randomness (0.0-3.0)
- `top_p` (number, optional): Nucleus sampling (0.0-1.0)
- `json` (boolean, optional): JSON format output
- `system` (string, optional): System prompt
- `stream` (boolean, optional): Stream output

**Example:**
```json
{
  "prompt": "Write a poem about spring",
  "model": "openai",
  "temperature": 0.8
}
```

#### pollinations_generate_audio tool

Generate audio from text.

**Parameters:**
- `prompt` (string): Text to convert
- `voice` (string, optional): Voice selection (alloy/echo/fable/onyx/nova/shimmer)
- `model` (string, optional): Audio model (default: openai-audio)

**Example:**
```json
{
  "prompt": "Hello, welcome to our service!",
  "voice": "nova"
}
```

#### pollinations_analyze_image tool

Analyze images using OpenAI compatible models.

**Parameters:**
- `image_path` (string, optional): Local image path
- `image_url` (string, optional): Image URL
- `prompt` (string): Analysis prompt text
- `model` (string, optional): Analysis model (default: openai)
- `max_tokens` (number, optional): Maximum output tokens

**Example:**
```json
{
  "image_path": "/path/to/image.jpg",
  "prompt": "What's in this image?",
  "model": "openai"
}
```

### Alibaba Qwen Tools

#### qwen_generate_text tool

Generate text using Alibaba Qwen models. (Note: Requires ALIYUN_API_KEY environment variable)

**Parameters:**
- `prompt` (string): Text prompt for the AI
- `model` (string, optional): Model for text generation (default: qwen-max)
- `temperature` (number, optional): Controls randomness (0.0-1.0)
- `top_p` (number, optional): Nucleus sampling parameter (0.0-1.0)
- `max_tokens` (number, optional): Maximum output tokens
- `system` (string, optional): System prompt to guide AI behavior

**Example:**
```json
{
  "prompt": "Write a poem about spring",
  "model": "qwen-max",
  "temperature": 0.8
}
```

#### qwen_analyze_image tool

Analyze image content using Alibaba Qwen-VL models. (Note: Requires ALIYUN_API_KEY environment variable)

**Parameters:**
- `image_path` (string, optional): Path to the local image file
- `image_url` (string, optional): URL of the image to analyze
- `prompt` (string): Text prompt describing what to analyze in the image
- `model` (string, optional): Model for vision analysis (default: qwen-vl-max)
- `temperature` (number, optional): Controls randomness (0.0-1.0)
- `top_p` (number, optional): Nucleus sampling parameter (0.0-1.0)
- `max_tokens` (number, optional): Maximum output tokens

**Example:**
```json
{
  "image_path": "/path/to/image.png",
  "prompt": "Please describe the main content in this image",
  "model": "qwen-vl-max"
}
```

#### qwen_analyze_video tool

Analyze video content using Alibaba Qwen-VL models. (Note: Requires ALIYUN_API_KEY environment variable)

**Parameters:**
- `video_url` (string): URL of the video to analyze
- `prompt` (string): Text prompt describing what to analyze in the video
- `model` (string, optional): Model for video analysis (default: qwen-vl-max)
- `temperature` (number, optional): Controls randomness (0.0-1.0)
- `top_p` (number, optional): Nucleus sampling parameter (0.0-1.0)
- `max_tokens` (number, optional): Maximum output tokens

**Example:**
```json
{
  "video_url": "https://example.com/video.mp4",
  "prompt": "Analyze the main content of this video",
  "model": "qwen-vl-max"
}
```

## License

ISC

## Contributing

Issues and Pull Requests are welcome!

