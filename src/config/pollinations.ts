export const POLLINATIONS_CONFIG = {
  baseUrl: {
    image: 'https://image.pollinations.ai',
    text: 'https://text.pollinations.ai'
  },
  defaultModels: {
    image: 'flux',
    text: 'openai',
    audio: 'openai-audio'
  },
  defaultParams: {
    image: {
      width: 1024,
      height: 1024
    },
    text: {
      temperature: 0.7,
      json: false
    },
    audio: {
      voice: 'alloy'
    }
  },
  voices: ['alloy', 'echo', 'fable', 'onyx', 'nova', ' shimmer']
};