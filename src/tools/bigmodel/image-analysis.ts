import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import * as fs from 'fs';
import { getApiKey, encodeImageToBase64, callGLMApi } from '../../utils/helpers.js';
import { createMessage, createErrorResponse, createSuccessResponse } from '../../utils/common.js';
import { logger } from '../../utils/logger.js';

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
        logger.info('read_image called', { image_path, prompt });
        if (!fs.existsSync(image_path)) {
          logger.error('Image file not found', { image_path });
          return createErrorResponse(`Image file not found: ${image_path}`);
        }

        const imageData = encodeImageToBase64(image_path);
        const messages = createMessage(
          [{ type: 'image_url', image_url: { url: imageData } }],
          prompt
        );

        logger.info('Analyzing image', { image_path, prompt });
        const result = await callGLMApi(
          messages,
          { temperature, top_p, max_tokens, modelType: 'image' },
          getApiKey()
        );

        logger.info('Image analysis completed', { image_path });
        return createSuccessResponse(result);
      } catch (error) {
        logger.error('Error in read_image tool', { error, image_path });
        return createErrorResponse(`Error analyzing image: ${error}`);
      }
    },
  );
}