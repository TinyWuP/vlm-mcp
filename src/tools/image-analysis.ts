import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import * as fs from 'fs';
import { getApiKey, encodeImageToBase64, callGLMApi } from '../utils/helpers.js';

export function registerImageAnalysisTool(server: McpServer) {
  server.tool(
    'read_image',
    'Analyze an image using GLM-4.5V model',
    {
      image_path: z.string().describe('Path to the local image file'),
      prompt: z.string().describe('Text prompt describing what to analyze in the image'),
      temperature: z.number().min(0).max(1).optional().describe('Sampling temperature (0.0-1.0)'),
      top_p: z.number().min(0).max(1).optional().describe('Top-p sampling parameter (0.0-1.0)'),
      max_tokens: z.number().min(1).max(16384).optional().describe('Maximum output tokens'),
    },
    async ({ image_path, prompt, temperature, top_p, max_tokens }) => {
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

        // Prepare messages
        const messages = [
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
        ];

        // Call GLM API with options
        const result = await callGLMApi(
          messages,
          { temperature, top_p, max_tokens },
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
}