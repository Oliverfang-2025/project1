import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

// Get database URL from environment variable
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(databaseUrl);

// Initialize database
export async function initDB() {
  // Create admins table
  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Check if default admin exists, if not create one
  const result = await sql`SELECT * FROM admins WHERE username = 'admin'`;
  if (result.length === 0) {
    const defaultPassword = 'admin123';
    const hash = bcrypt.hashSync(defaultPassword, 10);
    await sql`INSERT INTO admins (username, password_hash) VALUES ('admin', ${hash})`;
    console.log('Default admin account created: admin/admin123');
  }
}

// Verify login credentials
export async function verifyLogin(username: string, password: string): Promise<boolean> {
  const result = await sql`SELECT * FROM admins WHERE username = ${username}`;
  if (result.length === 0) return false;
  return bcrypt.compareSync(password, result[0].password_hash as string);
}

// Change password
export async function changePassword(username: string, oldPassword: string, newPassword: string): Promise<boolean> {
  const result = await sql`SELECT * FROM admins WHERE username = ${username}`;
  if (result.length === 0) return false;

  // Verify old password
  if (!bcrypt.compareSync(oldPassword, result[0].password_hash as string)) {
    return false;
  }

  // Update password
  const newHash = bcrypt.hashSync(newPassword, 10);
  await sql`UPDATE admins SET password_hash = ${newHash}, updated_at = CURRENT_TIMESTAMP WHERE username = ${username}`;
  return true;
}
