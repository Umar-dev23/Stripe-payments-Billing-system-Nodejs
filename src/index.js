import app from './app.js';
import { connectDB } from '../db.js';

// Middleware to ensure DB connection for Serverless requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

/**
 * LOCAL DEVELOPMENT LOGIC
 * Vercel ignores app.listen(), so we only run this if not in production.
 */
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;

  // Use dynamic imports to avoid loading socket/http in serverless environments
  Promise.all([import('http'), import('./modules/socket/socket.config.js'), connectDB()])
    .then(([{ createServer }, { default: initlizeSocket }]) => {
      const server = createServer(app);
      const io = initlizeSocket(server);
      app.set('io', io); // Makes IO accessible in routes via req.app.get('io')

      server.listen(PORT, () => {
        console.log(`🚀 Local Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to start local server:', err);
    });
}

// Export for Vercel
export default app;
