export function createMessage(content: any[], prompt: string) {
  return [{
    role: 'user' as const,
    content: [...content, { type: 'text' as const, text: prompt }]
  }];
}

export function createErrorResponse(message: string) {
  return {
    content: [{ type: 'text' as const, text: message }]
  };
}

export function createSuccessResponse(result: string) {
  return {
    content: [{ type: 'text' as const, text: result }]
  };
}