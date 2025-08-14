import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getApiKey, callGLMApi } from '../../utils/helpers.js';
import { createMessage, createErrorResponse, createSuccessResponse } from '../../utils/common.js';
import { logger } from '../../utils/logger.js';

export function registerVideoAnalysisTool(server: McpServer) {
  server.tool(
    'analyze_video',
    'Analyze a video using GLM-4.5V model',
    {
      video_url: z.string().url().describe('Publicly accessible URL of the video file to analyze'),
      prompt: z.string().describe('Text prompt describing what to analyze in the video'),
      temperature: z.number().min(0).max(1).optional().describe('Sampling temperature (0.0-1.0)'),
      top_p: z.number().min(0).max(1).optional().describe('Top-p sampling parameter (0.0-1.0)'),
      max_tokens: z.number().min(1).max(16384).optional().describe('Maximum output tokens'),
    },
    async ({ video_url, prompt, temperature, top_p, max_tokens }) => {
      try {
        logger.info('analyze_video called', { video_url, prompt });
        try {
          new URL(video_url);
        } catch {
          logger.error('Invalid video URL', { video_url });
          return createErrorResponse(`Invalid video URL: ${video_url}`);
        }

        const messages = createMessage(
          [{ type: 'video_url', video_url: { url: video_url } }],
          prompt
        );

        logger.info('Analyzing video', { video_url, prompt });
        const result = await callGLMApi(
          messages,
          { temperature, top_p, max_tokens, modelType: 'video' },
          getApiKey()
        );

        logger.info('Video analysis completed', { video_url });
        return createSuccessResponse(result);
      } catch (error) {
        logger.error('Error in analyze_video tool', { error, video_url });
        return createErrorResponse(`Error analyzing video: ${error}`);
      }
    },
  );
}