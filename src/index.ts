import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

const GLM_API_BASE = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

// Helper function to get API key from environment with fallback strategy
function getApiKey(): string {
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

// Create server instance
const server = new McpServer({
  name: '崮生mcp工具箱',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Helper function to encode image to base64
function encodeImageToBase64(imagePath: string): string {
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
async function callGLMApi(imageData: string, prompt: string, apiKey: string): Promise<string> {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Accept-Language': 'en-US,en',
    'Content-Type': 'application/json',
  };

  const payload = {
    model: 'glm-4.5v',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: imageData,
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
    thinking: {
      type: 'enabled',
    },
    stream: false,
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

// Register read_image tool
server.tool(
  'read_image',
  'Analyze an image using GLM-4.5V model',
  {
    image_path: z.string().describe('Path to the local image file'),
    prompt: z.string().describe('Text prompt describing what to analyze in the image'),
  },
  async ({ image_path, prompt }) => {
    try {
      // Validate image file exists
      if (!fs.existsSync(image_path)) {
        return {
          content: [
            {
              type: 'text',
              text: `Image file not found: ${image_path}`,
            },
          ],
        };
      }

      // Encode image to base64
      const imageData = encodeImageToBase64(image_path);

      // Call GLM API
      const result = await callGLMApi(
        imageData,
        prompt,
        getApiKey(),
      );

      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    } catch (error) {
      console.error('Error in read_image tool:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error analyzing image: ${error}`,
          },
        ],
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Image Reader MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
