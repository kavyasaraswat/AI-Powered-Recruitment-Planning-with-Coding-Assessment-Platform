import { createApp } from './app';
import { connectDB } from './config/db';
import { config } from './config/env';

const startServer = async () => {
  // Connect to database
  await connectDB();

  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`=======================================================`);
    console.log(`🚀 HireGenius AI Backend Server Running!`);
    console.log(`   Port:         ${config.port}`);
    console.log(`   Environment:  ${config.env}`);
    console.log(`   API Endpoint: http://localhost:${config.port}${config.apiPrefix}`);
    console.log(`   Health Check: http://localhost:${config.port}/health`);
    console.log(`=======================================================`);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('[Server] Gracefully shutting down...');
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

if (require.main === module) {
  startServer();
}

export { startServer };
