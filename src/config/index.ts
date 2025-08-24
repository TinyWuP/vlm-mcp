export const DEFAULT_CONFIG = {
  // 模型配置
  models: {
    image: 'glm-4.5v',
    video: 'glm-4.5v',
    generation: 'cogview-4'
  },

  // API 配置
  api: {
    timeout: 30000, // 30秒超时
    retryCount: 3
  },

  // 图片生成配置
  imageGeneration: {
    quality: 'standard' as const,
    size: '1024x1024' as const,
    supportedSizes: [
      '1024x1024',
      '768x1344',
      '864x1152',
      '1344x768',
      '1152x864',
      '1440x720',
      '720x1440'
    ] as const,
    supportedQualities: ['hd', 'standard'] as const,
    supportedModels: [
      'cogview-4-250304',
      'cogview-4',
      'cogview-3-flash'
    ] as const
  },

  // 分析配置
  analysis: {
    temperature: 0.8,
    top_p: 0.6,
    maxTokens: 16384
  }
};

export const ENV_VAR_MAPPING = {
  GLM_API_KEY: 'GLM_API_KEY',
  GLM_IMAGE_MODEL: 'GLM_IMAGE_MODEL',
  GLM_VIDEO_MODEL: 'GLM_VIDEO_MODEL',
  GLM_GENERATION_MODEL: 'GLM_GENERATION_MODEL'
} as const;