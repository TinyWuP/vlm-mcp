import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createSuccessResponse, createErrorResponse } from '../../utils/common.js';
import { logger } from '../../utils/logger.js';
import * as fs from 'fs';

export function registerPollinationsImageAnalysisTool(server: McpServer) {
  server.tool(
    'pollinations_analyze_image',
    'Analyze an image using Pollinations.AI Vision API',
    {
      image_path: z.string().optional().describe('Path to the local image file'),
      image_url: z.string().url().optional().describe('URL of the image to analyze'),
      prompt: z.string().describe('Text prompt describing what to analyze in the image'),
      model: z.string().optional().describe('Model for vision analysis (default: openai)'),
      max_tokens: z.number().min(1).max(4000).optional().describe('Maximum output tokens'),
    },
    async ({ image_path, image_url, prompt, model, max_tokens }) => {
      try {
        logger.info('pollinations_analyze_image called', { image_path, image_url, prompt, model });
        
        if (!image_path && !image_url) {
          return createErrorResponse('Either image_path or image_url must be provided');
        }
        
        if (image_path && image_url) {
          return createErrorResponse('Provide either image_path or image_url, not both');
        }
        
        let imageData: string;
        
        if (image_path) {
          if (!fs.existsSync(image_path)) {
            logger.error('Image file not found', { image_path });
            return createErrorResponse(`Image file not found: ${image_path}`);
          }
          
          const imageBuffer = fs.readFileSync(image_path);
          const base64Image = imageBuffer.toString('base64');
          const extension = image_path.split('.').pop()?.toLowerCase() || 'jpeg';
          imageData = `data:image/${extension};base64,${base64Image}`;
        } else {
          imageData = image_url!;
        }
        
        const requestBody = {
          model: model || 'openai',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: { url: imageData }
                }
              ]
            }
          ],
          max_tokens: max_tokens || 300
        };
        
        const response = await fetch('https://text.pollinations.ai/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        const analysisText = result.choices?.[0]?.message?.content || 'No analysis result';
        
        logger.info('Pollinations image analysis completed', { prompt, model });
        return createSuccessResponse(analysisText);
      } catch (error) {
        logger.error('Error in pollinations_analyze_image tool', { error });
        return createErrorResponse(`Error analyzing image: ${error}`);
      }
    }
  );
}