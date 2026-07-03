// src/utils/logger.ts
// Sistema de logging estruturado - NOVAIX FITNESS

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: number;
  component?: string;
  userId?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private minLevel: LogLevel = __DEV__ ? 'debug' : 'warn';

  private levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.minLevel];
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);

    // Manter apenas os últimos N logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output em dev
    if (__DEV__) {
      const prefix = `[${entry.level.toUpperCase()}]`;
      const component = entry.component ? `[${entry.component}]` : '';
      const message = `${prefix} ${component} ${entry.message}`;

      switch (entry.level) {
        case 'debug':
          console.debug(message, entry.data || '');
          break;
        case 'info':
          console.log(message, entry.data || '');
          break;
        case 'warn':
          console.warn(message, entry.data || '');
          break;
        case 'error':
          console.error(message, entry.data || '');
          break;
      }
    }
  }

  debug(message: string, data?: any, component?: string): void {
    if (!this.shouldLog('debug')) return;
    this.addLog({
      level: 'debug',
      message,
      data,
      timestamp: Date.now(),
      component,
    });
  }

  info(message: string, data?: any, component?: string): void {
    if (!this.shouldLog('info')) return;
    this.addLog({
      level: 'info',
      message,
      data,
      timestamp: Date.now(),
      component,
    });
  }

  warn(message: string, data?: any, component?: string): void {
    if (!this.shouldLog('warn')) return;
    this.addLog({
      level: 'warn',
      message,
      data,
      timestamp: Date.now(),
      component,
    });
  }

  error(message: string, error?: Error | any, component?: string): void {
    if (!this.shouldLog('error')) return;

    const data = error instanceof Error
      ? { message: error.message, stack: error.stack, name: error.name }
      : error;

    this.addLog({
      level: 'error',
      message,
      data,
      timestamp: Date.now(),
      component,
    });
  }

  // Log de performance
  performance(operation: string, duration: number, data?: any): void {
    this.info(`Performance: ${operation} took ${duration.toFixed(2)}ms`, data, 'Performance');
  }

  // Log de usuário
  userAction(action: string, userId: string, data?: any): void {
    this.info(`User action: ${action}`, { userId, ...data }, 'Analytics');
  }

  // Obter logs
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  // Obter logs como string
  getLogsAsString(): string {
    return this.logs
      .map(log => {
        const date = new Date(log.timestamp).toISOString();
        const component = log.component ? `[${log.component}]` : '';
        return `${date} [${log.level.toUpperCase()}] ${component} ${log.message}`;
      })
      .join('\n');
  }

  // Limpar logs
  clear(): void {
    this.logs = [];
  }

  // Exportar logs
  export(): LogEntry[] {
    return [...this.logs];
  }

  // Configurar nível mínimo
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }
}

// Instância singleton
export const logger = new Logger();

// Funções de conveniência
export const log = {
  debug: (msg: string, data?: any, component?: string) => logger.debug(msg, data, component),
  info: (msg: string, data?: any, component?: string) => logger.info(msg, data, component),
  warn: (msg: string, data?: any, component?: string) => logger.warn(msg, data, component),
  error: (msg: string, error?: any, component?: string) => logger.error(msg, error, component),
  performance: (op: string, duration: number, data?: any) => logger.performance(op, duration, data),
  userAction: (action: string, userId: string, data?: any) => logger.userAction(action, userId, data),
};

export default logger;
