import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createSuccessResponse, createErrorResponse } from '../../utils/common.js';
import { POLLINATIONS_CONFIG } from '../../config/pollinations.js';
import { logger } from '../../utils/logger.js';

export function registerPollinationsImageGenerationTool(server: McpServer) {
  server.tool(
    'pollinations_generate_image',
    'Generate an image using Pollinations.AI API',
    {
      prompt: z.string().describe('Text description of the image to generate'),
      model: z.string().optional().describe('Model for image generation (default: flux)'),
      width: z.number().min(64).max(2048).optional().describe('Image width in pixels (default: 1024)'),
      height: z.number().min(64).max(2048).optional().describe('Image height in pixels (default: 1024)'),
      seed: z.number().optional().describe('Seed for reproducible results'),
      nologo: z.boolean().optional().describe('Disable Pollinations logo overlay (default: false)'),
      private: z.boolean().optional().describe('Prevent image from appearing in public feed (default: false)'),
      enhance: z.boolean().optional().describe('Enhance prompt using LLM for more detail (default: false)'),
      safe: z.boolean().optional().describe('Strict NSFW filtering (default: false)'),
      transparent: z.boolean().optional().describe('Generate with transparent background (gptimage model only)'),
    },
    async ({ prompt, model, width, height, seed, nologo, private: isPrivate, enhance, safe, transparent }) => {
      try {
        logger.info('pollinations_generate_image called', { prompt, model, width, height });
        
        const params = new URLSearchParams({
          prompt: prompt
        });
        
        if (model) params.append('model', model);
        if (width) params.append('width', width.toString());
        if (height) params.append('height', height.toString());
        if (seed) params.append('seed', seed.toString());
        if (nologo) params.append('nologo', 'true');
        if (isPrivate) params.append('private', 'true');
        if (enhance) params.append('enhance', 'true');
        if (safe) params.append('safe', 'true');
        if (transparent) params.append('transparent', 'true');
        
        const imageUrl = `${POLLINATIONS_CONFIG.baseUrl.image}/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
        
        logger.info('Pollinations image generated', { imageUrl });
        return createSuccessResponse(imageUrl);
      } catch (error) {
        logger.error('Error in pollinations_generate_image tool', { error });
        return createErrorResponse(`Error generating image: ${error}`);
      }
    }
  );
}