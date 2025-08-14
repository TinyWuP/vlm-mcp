import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getApiKey, callGLMApi } from '../utils/helpers.js';

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
        // Validate video URL is publicly accessible
        // Note: We can't fully validate accessibility without making a request,
        // but we can validate the URL format
        try {
          new URL(video_url);
        } catch (urlError) {
          return {
            content: [
              {
                type: 'text',
                text: `Invalid video URL: ${video_url}. Please provide a valid publicly accessible URL.`,
              },
            ],
          };
        }

        // Prepare messages with video URL
        const messages = [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Please analyze this video file based on the following request: ${prompt}`,
              },
              {
                type: 'video_url',
                video_url: {
                  url: video_url,
                },
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
        console.error('Error in analyze_video tool:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error analyzing video: ${error}`,
            },
          ],
        };
      }
    },
  );
}