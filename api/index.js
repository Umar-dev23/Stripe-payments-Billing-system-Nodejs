import app from '../src/app.js'; // Adjust path to your app.js
import { connectDB } from '../db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    // This allows Express to handle the req/res
    return app(req, res);
  } catch (err) {
    res.status(500).send('Database connection error');
  }
}
