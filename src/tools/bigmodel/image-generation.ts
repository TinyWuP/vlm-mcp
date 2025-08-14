import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getApiKey, generateImage } from '../../utils/helpers.js';
import { createSuccessResponse, createErrorResponse } from '../../utils/common.js';
import { DEFAULT_CONFIG } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import * as fs from 'fs';
import * as path from 'path';

export function registerImageGenerationTool(server: McpServer) {
  server.tool(
    'generate_image',
    'Generate an image from text prompt using CogView-4 model',
    {
      prompt: z.string().describe('Text description of the image to generate'),
      quality: z.enum(['hd', 'standard']).optional()
        .describe(`Image quality. hd: higher quality but slower (20s), standard: faster (5-10s). Default: ${DEFAULT_CONFIG.imageGeneration.quality}`),
      size: z.enum(DEFAULT_CONFIG.imageGeneration.supportedSizes).optional()
        .describe(`Image size. Default: ${DEFAULT_CONFIG.imageGeneration.size}`),
      save_path: z.string().optional().describe('Local path to save the generated image'),
    },
    async ({ prompt, quality, size, save_path }) => {
      try {
        logger.info('generate_image called', { prompt, quality, size, save_path });
        if (!prompt.trim()) {
          return createErrorResponse('Prompt cannot be empty');
        }

        logger.info('Generating image with prompt', { prompt });
        const result = await generateImage(
          prompt,
          { quality, size },
          getApiKey()
        );

        if (!result.url) {
          logger.error('Image generation failed: No URL returned');
          return createErrorResponse('Failed to generate image: No URL returned');
        }

        if (save_path) {
          try {
            logger.info('Downloading image to local path', { url: result.url, save_path });
            const response = await fetch(result.url);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const dir = path.dirname(save_path);
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(save_path, buffer);
            logger.info('Image downloaded successfully', { save_path });
            return createSuccessResponse(`Image saved to: ${save_path}`);
          } catch (error) {
            logger.error('Failed to download image', { error, url: result.url, save_path });
            return createSuccessResponse(result.url);
          }
        } else {
          logger.info('Image generated, returning URL', { url: result.url });
          return createSuccessResponse(result.url);
        }
      } catch (error) {
        logger.error('Error in generate_image tool', { error });
        return createErrorResponse(`Error generating image: ${error}`);
      }
    },
  );
}