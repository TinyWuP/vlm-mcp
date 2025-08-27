import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createSuccessResponse, createErrorResponse } from '../../utils/common.js';
import { QWEN_CONFIG } from '../../config/qwen.js';
import { logger } from '../../utils/logger.js';
import { getApiKey } from '../../utils/helpers.js';

export function registerQwenVideoAnalysisTool(server: McpServer) {
  server.tool(
    'qwen_analyze_video',
    'Analyze a video using Alibaba Qwen-VL API',
    {
      video_url: z.string().url().describe('URL of the video to analyze'),
      prompt: z.string().describe('Text prompt describing what to analyze in the video'),
      model: z.string().optional().describe('Model for video analysis (default: qwen-vl-max)'),
      temperature: z.number().min(0).max(1).optional().describe('Controls randomness (0.0-1.0)'),
      top_p: z.number().min(0).max(1).optional().describe('Nucleus sampling parameter (0.0-1.0)'),
      max_tokens: z.number().min(1).max(16384).optional().describe('Maximum output tokens'),
    },
    async ({ video_url, prompt, model, temperature, top_p, max_tokens }) => {
      try {
        logger.info('qwen_analyze_video called', { video_url, prompt, model });
        
        const apiKey = getApiKey('aliyun');
        const selectedModel = model || QWEN_CONFIG.defaultModels.multimodal;
        
        // Validate model
        if (!QWEN_CONFIG.supportedModels.multimodal.includes(selectedModel)) {
          return createErrorResponse(`Unsupported model: ${selectedModel}. Supported models: ${QWEN_CONFIG.supportedModels.multimodal.join(', ')}`);
        }
        
        const requestBody: any = {
          model: selectedModel,
          input: {
            messages: [
              {
                role: 'user',
                content: [
                  {
                    text: prompt
                  },
                  {
                    video: video_url
                  }
                ]
              }
            ]
          },
          parameters: {
            temperature: temperature !== undefined ? temperature : QWEN_CONFIG.defaultParams.multimodal.temperature,
            top_p: top_p !== undefined ? top_p : QWEN_CONFIG.defaultParams.multimodal.top_p,
            ...(max_tokens && { max_tokens })
          }
        };
        
        const response = await fetch(QWEN_CONFIG.baseUrl.multimodal, {
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
        
        // 根据阿里云Qwen API文档，正确提取分析结果
        let analysisText = 'No analysis result';
        if (result.output && result.output.choices && result.output.choices.length > 0) {
          const content = result.output.choices[0].message.content;
          if (Array.isArray(content) && content.length > 0 && content[0].text) {
            analysisText = content[0].text;
          } else if (typeof content === 'string') {
            analysisText = content;
          }
        } else if (result.output && result.output.text) {
          analysisText = result.output.text;
        } else if (result.choices && result.choices.length > 0) {
          const content = result.choices[0].message.content;
          if (Array.isArray(content) && content.length > 0 && content[0].text) {
            analysisText = content[0].text;
          } else if (typeof content === 'string') {
            analysisText = content;
          }
        }
        
        logger.info('Qwen video analysis completed', { prompt, model: selectedModel });
        return createSuccessResponse(analysisText);
      } catch (error) {
        logger.error('Error in qwen_analyze_video tool', { error });
        return createErrorResponse(`Error analyzing video: ${error}`);
      }
    }
  );
}