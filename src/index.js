import { app } from './app.js';
import { pool } from './config/db.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.log(`Expert Listing API listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

// Graceful shutdown handling
const shutdown = async (signal) => {
  console.log(`Received ${signal}. Gracefully shutting down...`);
  server.close(async () => {
    try {
      await pool.end();
      console.log('Database pool closed. Exiting process.');
      process.exit(0);
    } catch (err) {
      console.error('Error during database pool closure:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
