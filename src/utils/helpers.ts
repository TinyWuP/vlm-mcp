import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { DEFAULT_CONFIG } from '../config/index.js';

export const GLM_API_BASE = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
export const GLM_IMAGE_BASE = 'https://open.bigmodel.cn/api/paas/v4/images/generations';

export function getApiKey(provider: 'glm' | 'aliyun' = 'glm'): string {
  const envVar = provider === 'aliyun' ? 'ALIYUN_API_KEY' : 'GLM_API_KEY';
  
  if (process.env[envVar]) {
    return process.env[envVar];
  }

  const envPaths = [
    path.join(process.cwd(), '.env'),
    path.join(path.dirname(__dirname), '.env')
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const env = dotenv.parse(fs.readFileSync(envPath));
      if (env[envVar]) {
        return env[envVar];
      }
    }
  }

  throw new Error(`${envVar} environment variable is required`);
}

export function getModelConfig(type: 'image' | 'video' | 'generation' | 'qwen'): string {
  const envVar = `GLM_${type.toUpperCase()}_MODEL`;
  return process.env[envVar] || DEFAULT_CONFIG.models[type];
}

export function encodeImageToBase64(imagePath: string): string {
  const imageBuffer = fs.readFileSync(imagePath);
  const ext = path.extname(imagePath).toLowerCase().slice(1);
  const mimeType = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif'
  }[ext] || 'image/png';
  return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
}

export async function callGLMApi(
  messages: any[],
  options: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
    modelType?: 'image' | 'video';
  } = {},
  apiKey: string
): Promise<string> {
  const response = await fetch(GLM_API_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: getModelConfig(options.modelType || 'image'),
      messages,
      thinking: { type: 'enabled' },
      stream: false,
      temperature: options.temperature ?? 0.8,
      top_p: options.top_p ?? 0.6,
      ...(options.max_tokens && { max_tokens: options.max_tokens }),
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content || 'No response from API';
}

export async function generateImage(
  prompt: string,
  options: {
    model?: string;
    quality?: 'hd' | 'standard';
    size?: string;
    user_id?: string;
  } = {},
  apiKey: string
): Promise<{ url: string; created: number }> {
  const { supportedModels, supportedQualities, supportedSizes } = DEFAULT_CONFIG.imageGeneration;
  
  if (options.model && !supportedModels.includes(options.model as any)) {
    throw new Error(`Unsupported model: ${options.model}. Supported: ${supportedModels.join(', ')}`);
  }
  
  if (options.quality && !supportedQualities.includes(options.quality)) {
    throw new Error(`Unsupported quality: ${options.quality}. Supported: ${supportedQualities.join(', ')}`);
  }
  
  if (options.size && !supportedSizes.includes(options.size as any)) {
    throw new Error(`Unsupported size: ${options.size}. Supported: ${supportedSizes.join(', ')}`);
  }

  const response = await fetch(GLM_IMAGE_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model || getModelConfig('generation'),
      prompt,
      quality: options.quality || DEFAULT_CONFIG.imageGeneration.quality,
      size: options.size || DEFAULT_CONFIG.imageGeneration.size,
      ...(options.user_id && { user_id: options.user_id }),
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return {
    url: result.data?.[0]?.url || '',
    created: result.created || Date.now()
  };
}

