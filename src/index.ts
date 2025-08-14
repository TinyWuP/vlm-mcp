import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerImageAnalysisTool } from './tools/image-analysis.js';
import { registerVideoAnalysisTool } from './tools/video-analysis.js';

// Create server instance
const server = new McpServer({
  name: '崮生mcp工具箱',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register all tools
registerImageAnalysisTool(server);
registerVideoAnalysisTool(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GLM-4.5V MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});