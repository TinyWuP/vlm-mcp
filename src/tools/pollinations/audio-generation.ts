import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createSuccessResponse, createErrorResponse } from '../../utils/common.js';
import { POLLINATIONS_CONFIG } from '../../config/pollinations.js';
import { logger } from '../../utils/logger.js';

export function registerPollinationsAudioGenerationTool(server: McpServer) {
  server.tool(
    'pollinations_generate_audio',
    'Generate speech audio from text using Pollinations.AI API',
    {
      prompt: z.string().describe('Text to synthesize into speech'),
      voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).optional()
        .describe('Voice to use for synthesis (default: alloy)'),
      model: z.string().optional().describe('Model for audio generation (default: openai-audio)'),
    },
    async ({ prompt, voice, model }) => {
      try {
        logger.info('pollinations_generate_audio called', { prompt, voice, model });
        
        const params = new URLSearchParams();
        
        params.append('model', model || POLLINATIONS_CONFIG.defaultModels.audio);
        if (voice) params.append('voice', voice);
        
        const url = `${POLLINATIONS_CONFIG.baseUrl.text}/${encodeURIComponent(prompt)}?${params.toString()}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString('base64');
        
        logger.info('Pollinations audio generated', { prompt, voice, model, audioSize: audioBuffer.byteLength });
        return createSuccessResponse(`data:audio/mpeg;base64,${base64Audio}`);
      } catch (error) {
        logger.error('Error in pollinations_generate_audio tool', { error });
        return createErrorResponse(`Error generating audio: ${error}`);
      }
    }
  );
}