export const QWEN_CONFIG = {
  baseUrl: {
    chat: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    multimodal: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'
  },
  defaultModels: {
    text: 'qwen-max',
    multimodal: 'qwen-vl-max'
  },
  defaultParams: {
    text: {
      temperature: 0.8,
      top_p: 0.8
    },
    multimodal: {
      temperature: 0.8,
      top_p: 0.8
    }
  },
  supportedModels: {
    text: [
      'qwen-turbo',
      'qwen-plus',
      'qwen-max',
      'qwen-72b-chat'
    ],
    multimodal: [
      'qwen-vl-plus',
      'qwen-vl-max'
    ]
  }
};