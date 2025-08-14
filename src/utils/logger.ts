import * as fs from 'fs';
import * as path from 'path';

export class Logger {
  private logFilePath: string;

  constructor(projectDir: string = process.cwd()) {
    this.logFilePath = path.join(projectDir, 'mcpserver.log');
  }

  private writeLog(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}${data ? ' - ' + JSON.stringify(data) : ''}\n`;
    
    try {
      fs.appendFileSync(this.logFilePath, logEntry);
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  info(message: string, data?: any) {
    this.writeLog('INFO', message, data);
  }

  error(message: string, data?: any) {
    this.writeLog('ERROR', message, data);
  }

  debug(message: string, data?: any) {
    this.writeLog('DEBUG', message, data);
  }

  warn(message: string, data?: any) {
    this.writeLog('WARN', message, data);
  }
}

export const logger = new Logger();