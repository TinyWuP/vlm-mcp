import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createSuccessResponse, createErrorResponse } from '../../utils/common.js';
import { POLLINATIONS_CONFIG } from '../../config/pollinations.js';
import { logger } from '../../utils/logger.js';

export function registerPollinationsTextGenerationTool(server: McpServer) {
  server.tool(
    'pollinations_generate_text',
    'Generate text using Pollinations.AI API',
    {
      prompt: z.string().describe('Text prompt for the AI'),
      model: z.string().optional().describe('Model for text generation (default: openai)'),
      seed: z.number().optional().describe('Seed for reproducible results'),
      temperature: z.number().min(0).max(3).optional().describe('Controls randomness (0.0-3.0)'),
      top_p: z.number().min(0).max(1).optional().describe('Nucleus sampling parameter (0.0-1.0)'),
      presence_penalty: z.number().min(-2).max(2).optional().describe('Penalizes tokens based on presence'),
      frequency_penalty: z.number().min(-2).max(2).optional().describe('Penalizes tokens based on frequency'),
      json: z.boolean().optional().describe('Return response as JSON string (default: false)'),
      system: z.string().optional().describe('System prompt to guide AI behavior'),
      stream: z.boolean().optional().describe('Enable streaming responses (default: false)'),
      private: z.boolean().optional().describe('Prevent response from appearing in public feed'),
    },
    async ({ prompt, model, seed, temperature, top_p, presence_penalty, frequency_penalty, json, system, stream, private: isPrivate }) => {
      try {
        logger.info('pollinations_generate_text called', { prompt, model });
        
        const params = new URLSearchParams();
        
        if (model) params.append('model', model);
        if (seed) params.append('seed', seed.toString());
        if (temperature !== undefined) params.append('temperature', temperature.toString());
        if (top_p !== undefined) params.append('top_p', top_p.toString());
        if (presence_penalty !== undefined) params.append('presence_penalty', presence_penalty.toString());
        if (frequency_penalty !== undefined) params.append('frequency_penalty', frequency_penalty.toString());
        if (json) params.append('json', 'true');
        if (system) params.append('system', system);
        if (stream) params.append('stream', 'true');
        if (isPrivate) params.append('private', 'true');
        
        const url = `${POLLINATIONS_CONFIG.baseUrl.text}/${encodeURIComponent(prompt)}${params.toString() ? '?' + params.toString() : ''}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.text();
        
        logger.info('Pollinations text generated', { prompt, model, resultLength: result.length });
        return createSuccessResponse(result);
      } catch (error) {
        logger.error('Error in pollinations_generate_text tool', { error });
        return createErrorResponse(`Error generating text: ${error}`);
      }
    }
  );
}