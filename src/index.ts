import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerImageAnalysisTool } from './tools/bigmodel/image-analysis.js';
import { registerVideoAnalysisTool } from './tools/bigmodel/video-analysis.js';
import { registerImageGenerationTool } from './tools/bigmodel/image-generation.js';
import { registerPollinationsImageGenerationTool } from './tools/pollinations/image-generation.js';
import { registerPollinationsTextGenerationTool } from './tools/pollinations/text-generation.js';
import { registerPollinationsAudioGenerationTool } from './tools/pollinations/audio-generation.js';
import { registerPollinationsImageAnalysisTool } from './tools/pollinations/image-analysis.js';
import { registerQwenTextGenerationTool } from './tools/qwen/text-generation.js';
import { registerQwenImageAnalysisTool } from './tools/qwen/image-analysis.js';
import { registerQwenVideoAnalysisTool } from './tools/qwen/video-analysis.js';

const server = new McpServer({
  name: '崮生mcp工具箱',
  version: '1.0.0',
  capabilities: { resources: {}, tools: {} },
});

registerImageAnalysisTool(server);
registerVideoAnalysisTool(server);
registerImageGenerationTool(server);
registerPollinationsImageGenerationTool(server);
registerPollinationsTextGenerationTool(server);
registerPollinationsAudioGenerationTool(server);
registerPollinationsImageAnalysisTool(server);
registerQwenTextGenerationTool(server);
registerQwenImageAnalysisTool(server);
registerQwenVideoAnalysisTool(server);

async function main() {
  await server.connect(new StdioServerTransport());
  console.error('GLM-4.5V & Pollinations & Qwen-VL-Max MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});