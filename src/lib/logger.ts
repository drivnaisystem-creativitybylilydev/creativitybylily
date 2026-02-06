type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  userId?: string;
  orderId?: string;
  error?: string;
  stack?: string;
}

function log(level: LogLevel, message: string, context?: Record<string, any>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  // Console output (Vercel captures this automatically)
  const logFn = level === 'debug' ? console.log : console[level];
  logFn(JSON.stringify(entry));

  // Future: Could send to external service like Logtail, Axiom, etc.
}

export const logger = {
  info: (message: string, context?: Record<string, any>) => {
    log('info', message, context);
  },
  
  warn: (message: string, context?: Record<string, any>) => {
    log('warn', message, context);
  },
  
  error: (message: string, error?: Error | unknown, context?: Record<string, any>) => {
    log('error', message, {
      ...context,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  },
  
  debug: (message: string, context?: Record<string, any>) => {
    // Only log debug messages in development
    if (process.env.NODE_ENV === 'development') {
      log('debug', message, context);
    }
  },
  
  // Specialized loggers for common events
  payment: {
    attempted: (orderId: string, amount: number) => {
      log('info', 'Payment attempted', { orderId, amount, event: 'payment_attempted' });
    },
    succeeded: (orderId: string, paymentId: string, amount: number) => {
      log('info', 'Payment succeeded', { orderId, paymentId, amount, event: 'payment_succeeded' });
    },
    failed: (orderId: string, amount: number, reason: string) => {
      log('error', 'Payment failed', { orderId, amount, reason, event: 'payment_failed' });
    },
  },
  
  order: {
    created: (orderId: string, userId?: string, total?: number) => {
      log('info', 'Order created', { orderId, userId, total, event: 'order_created' });
    },
    statusChanged: (orderId: string, oldStatus: string, newStatus: string) => {
      log('info', 'Order status changed', { orderId, oldStatus, newStatus, event: 'order_status_changed' });
    },
  },
  
  shipping: {
    labelCreated: (orderId: string, trackingNumber: string) => {
      log('info', 'Shipping label created', { orderId, trackingNumber, event: 'label_created' });
    },
    labelFailed: (orderId: string, error: string) => {
      log('error', 'Shipping label creation failed', { orderId, error, event: 'label_failed' });
    },
  },
  
  email: {
    sent: (to: string, subject: string, type: string) => {
      log('info', 'Email sent', { to, subject, type, event: 'email_sent' });
    },
    failed: (to: string, subject: string, error: string) => {
      log('error', 'Email send failed', { to, subject, error, event: 'email_failed' });
    },
  },
};
