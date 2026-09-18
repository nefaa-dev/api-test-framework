type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const threshold = LEVEL_ORDER[(process.env.LOG_LEVEL as LogLevel) ?? 'info'];

function log(level: LogLevel, message: string): void {
  if (LEVEL_ORDER[level] < threshold) return;
  const line = `${new Date().toISOString()} [${level.toUpperCase()}] ${message}`;
  (level === 'error' ? console.error : console.log)(line);
}

export const logger = {
  debug: (message: string): void => log('debug', message),
  info: (message: string): void => log('info', message),
  warn: (message: string): void => log('warn', message),
  error: (message: string): void => log('error', message),
};