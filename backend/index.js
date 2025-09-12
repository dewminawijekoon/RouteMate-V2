import express from 'express';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

// Check database connection on startup
async function checkDbConnection() {
  try {
    await sql`SELECT 1`;
    console.log('Database connection successful');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}
checkDbConnection();

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
