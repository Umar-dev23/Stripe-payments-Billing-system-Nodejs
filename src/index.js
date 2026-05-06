import mongoose from 'mongoose';
import app from './app.js';
import { createServer } from 'http';
import initlizeSocket from './modules/socket/socket.config.js';

const PORT = 3000;
const MONGO_URI = process.env.MONGODB_URI;
const server = createServer(app);
const io = initlizeSocket(server);

app.set('io', io);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('❌ DB Connection Error:', err));
