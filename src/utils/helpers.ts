import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

export const GLM_API_BASE = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
export const GLM_FILES_BASE = 'https://open.bigmodel.cn/api/paas/v4/files';

// Helper function to get API key from environment with fallback strategy
export function getApiKey(): string {
  // 1. Check if API key is already in environment variables
  if (process.env.GLM_API_KEY) {
    return process.env.GLM_API_KEY;
  }

  // 2. Try to load from .env file in current working directory (execution directory)
  const cwdEnvPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(cwdEnvPath)) {
    const cwdEnv = dotenv.parse(fs.readFileSync(cwdEnvPath));
    if (cwdEnv.GLM_API_KEY) {
      return cwdEnv.GLM_API_KEY;
    }
  }

  // 3. Try to load from .env file in project directory (script directory)
  const projectEnvPath = path.join(path.dirname(__dirname), '.env');
  if (fs.existsSync(projectEnvPath)) {
    const projectEnv = dotenv.parse(fs.readFileSync(projectEnvPath));
    if (projectEnv.GLM_API_KEY) {
      return projectEnv.GLM_API_KEY;
    }
  }

  // 4. Check user environment variables (already covered by process.env)
  // This is the fallback - if we reach here, no API key was found
  throw new Error('GLM_API_KEY environment variable is required. Please set it in your environment or in a .env file.');
}

// Helper function to encode image to base64
export function encodeImageToBase64(imagePath: string): string {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const ext = path.extname(imagePath).toLowerCase().slice(1);
    const mimeType =
      ext === 'png'
        ? 'image/png'
        : ext === 'jpg' || ext === 'jpeg'
        ? 'image/jpeg'
        : ext === 'gif'
        ? 'image/gif'
        : 'image/png';
    return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    throw new Error(`Failed to read image file: ${error}`);
  }
}

// Helper function to call GLM-4.5V API
export async function callGLMApi(
  messages: any[],
  options: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
    stream?: boolean;
    thinking?: any;
  } = {},
  apiKey: string
): Promise<string> {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Accept-Language': 'en-US,en',
    'Content-Type': 'application/json',
  };

  const payload = {
    model: 'glm-4.5v',
    messages,
    thinking: options.thinking || { type: 'enabled' },
    stream: options.stream || false,
    temperature: options.temperature ?? 0.8,
    top_p: options.top_p ?? 0.6,
    ...(options.max_tokens && { max_tokens: options.max_tokens }),
  };

  try {
    const response = await fetch(GLM_API_BASE, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.choices?.[0]?.message?.content || 'No response from API';
  } catch (error) {
    console.error('Error calling GLM API:', error);
    throw new Error(`Failed to call GLM API: ${error}`);
  }
}

