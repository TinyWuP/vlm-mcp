import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createSuccessResponse, createErrorResponse } from '../../utils/common.js';
import { QWEN_CONFIG } from '../../config/qwen.js';
import { logger } from '../../utils/logger.js';
import { getApiKey } from '../../utils/helpers.js';

export function registerQwenTextGenerationTool(server: McpServer) {
  server.tool(
    'qwen_generate_text',
    'Generate text using Alibaba Qwen API',
    {
      prompt: z.string().describe('Text prompt for the AI'),
      model: z.string().optional().describe('Model for text generation (default: qwen-max)'),
      temperature: z.number().min(0).max(1).optional().describe('Controls randomness (0.0-1.0)'),
      top_p: z.number().min(0).max(1).optional().describe('Nucleus sampling parameter (0.0-1.0)'),
      max_tokens: z.number().min(1).max(16384).optional().describe('Maximum output tokens'),
      system: z.string().optional().describe('System prompt to guide AI behavior'),
    },
    async ({ prompt, model, temperature, top_p, max_tokens, system }) => {
      try {
        logger.info('qwen_generate_text called', { prompt, model });
        
        const apiKey = getApiKey('aliyun');
        const selectedModel = model || QWEN_CONFIG.defaultModels.text;
        
        // Validate model
        if (!QWEN_CONFIG.supportedModels.text.includes(selectedModel)) {
          return createErrorResponse(`Unsupported model: ${selectedModel}. Supported models: ${QWEN_CONFIG.supportedModels.text.join(', ')}`);
        }
        
        const requestBody: any = {
          model: selectedModel,
          input: {
            messages: [
              ...(system ? [{ role: 'system', content: system }] : []),
              { role: 'user', content: prompt }
            ]
          },
          parameters: {
            temperature: temperature !== undefined ? temperature : QWEN_CONFIG.defaultParams.text.temperature,
            top_p: top_p !== undefined ? top_p : QWEN_CONFIG.defaultParams.text.top_p,
            ...(max_tokens && { max_tokens })
          }
        };
        
        const response = await fetch(QWEN_CONFIG.baseUrl.chat, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'X-DashScope-SSE': 'disable'
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          logger.error('Qwen API error', { status: response.status, error: errorText });
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const result = await response.json();
        logger.info('Qwen API response', { response: JSON.stringify(result) });
        
        // 根据阿里云Qwen API文档，正确提取生成结果
        let generatedText = 'No response generated';
        if (result.output && result.output.choices && result.output.choices.length > 0) {
          const content = result.output.choices[0].message.content;
          if (Array.isArray(content) && content.length > 0 && content[0].text) {
            generatedText = content[0].text;
          } else if (typeof content === 'string') {
            generatedText = content;
          } else {
            generatedText = JSON.stringify(content);
          }
        } else if (result.output && result.output.text) {
          generatedText = result.output.text;
        } else if (result.choices && result.choices.length > 0) {
          const content = result.choices[0].message.content;
          if (Array.isArray(content) && content.length > 0 && content[0].text) {
            generatedText = content[0].text;
          } else if (typeof content === 'string') {
            generatedText = content;
          } else {
            generatedText = JSON.stringify(content);
          }
        }
        
        logger.info('Qwen text generated', { prompt, model: selectedModel, resultLength: generatedText.length });
        return createSuccessResponse(generatedText);
      } catch (error) {
        logger.error('Error in qwen_generate_text tool', { error });
        return createErrorResponse(`Error generating text: ${error}`);
      }
    }
  );
}