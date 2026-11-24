import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import authRoutes from './routes/authRoutes';
import candidateRoutes from './routes/candidateRoutes';
import recruiterRoutes from './routes/recruiterRoutes';
import jobRoutes from './routes/jobRoutes';
import aiRoutes from './routes/aiRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import chatRoutes from './routes/chatRoutes';

export const createApp = (): Application => {
  const app: Application = express();

  // 1. Security HTTP Headers
  app.use(helmet());

  // 2. CORS configuration with credentials support
  app.use(
    cors({
      origin: [config.clientUrl, 'http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // 3. Body & Cookie Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(config.cookieSecret));

  // 4. System Health Check Endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'HireGenius AI Backend Core',
      version: '1.0.0',
    });
  });

  // 5. Mount API Routes
  app.use(`${config.apiPrefix}/auth`, authRoutes);
  app.use(`${config.apiPrefix}/candidates`, candidateRoutes);
  app.use(`${config.apiPrefix}/recruiters`, recruiterRoutes);
  app.use(`${config.apiPrefix}/jobs`, jobRoutes);
  app.use(`${config.apiPrefix}/ai`, aiRoutes);
  app.use(`${config.apiPrefix}/assessments`, assessmentRoutes);
  app.use(`${config.apiPrefix}/chat`, chatRoutes);

  // 6. 404 Route Handler
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'NotFound',
      message: `The requested endpoint ${req.originalUrl} does not exist on this server.`,
    });
  });

  // 7. Global Centralized Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[Unhandled Error Handler]:', err);
    res.status(err.status || 500).json({
      success: false,
      error: err.name || 'InternalServerError',
      message: err.message || 'An unexpected server error occurred.',
    });
  });

  return app;
};
