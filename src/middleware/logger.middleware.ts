import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const logFilePath = path.join(__dirname, '..', 'logs', 'requests.log');

    // Create logs directory if it doesn't exist
    if (!fs.existsSync(path.dirname(logFilePath))) {
      fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    }

    // Log request data
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
    };

    const logMessage = `${JSON.stringify(logData, null, 2)}\n----------------------------------------\n`;

    // Append log to file
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Error writing log:', err);
      }
    });

    next();
  }
}
