import fs from 'fs';
import path from 'path';

const logsDir = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export const logger = {
  info: (message: string, meta?: any) => {
    const log = {
      level: 'INFO',
      message,
      timestamp: new Date().toISOString(),
      meta
    };
    console.log(`[INFO] ${message}`, meta || '');
    
    if (process.env.NODE_ENV === 'production') {
      fs.appendFileSync(
        path.join(logsDir, 'app.log'),
        JSON.stringify(log) + '\n'
      );
    }
  },
  
  error: (message: string, error?: any) => {
    const log = {
      level: 'ERROR',
      message,
      timestamp: new Date().toISOString(),
      error: error?.stack || error
    };
    console.error(`[ERROR] ${message}`, error || '');
    
    if (process.env.NODE_ENV === 'production') {
      fs.appendFileSync(
        path.join(logsDir, 'error.log'),
        JSON.stringify(log) + '\n'
      );
    }
  },
  
  warn: (message: string, meta?: any) => {
    const log = {
      level: 'WARN',
      message,
      timestamp: new Date().toISOString(),
      meta
    };
    console.warn(`[WARN] ${message}`, meta || '');
  }
};