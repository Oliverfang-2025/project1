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

  // Create articles table (blog posts)
  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      title_zh VARCHAR(500) NOT NULL,
      title_en VARCHAR(500),
      slug VARCHAR(255) UNIQUE NOT NULL,
      content_zh TEXT,
      content_en TEXT,
      excerpt_zh TEXT,
      excerpt_en TEXT,
      cover_image TEXT,
      category VARCHAR(100),
      tags JSONB DEFAULT '[]'::jsonb,
      status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
      author VARCHAR(255),
      view_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      published_at TIMESTAMP
    )
  `;

  // Create articles indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_articles_title_zh ON articles(title_zh)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_articles_title_en ON articles(title_en)`;

  // Create projects table (portfolio)
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title_zh VARCHAR(500) NOT NULL,
      title_en VARCHAR(500),
      slug VARCHAR(255) UNIQUE NOT NULL,
      description_zh TEXT,
      description_en TEXT,
      cover_image TEXT,
      tech_stack JSONB DEFAULT '[]'::jsonb,
      demo_url TEXT,
      github_url TEXT,
      featured BOOLEAN DEFAULT false,
      status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create projects indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_projects_title_zh ON projects(title_zh)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_projects_title_en ON projects(title_en)`;

  // Create site_config table (site configuration)
  await sql`
    CREATE TABLE IF NOT EXISTS site_config (
      id SERIAL PRIMARY KEY,
      key VARCHAR(255) UNIQUE NOT NULL,
      value JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create site_config index
  await sql`CREATE INDEX IF NOT EXISTS idx_site_config_key ON site_config(key)`;

  // Create messages table (visitor messages)
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(500),
      content TEXT NOT NULL,
      read BOOLEAN DEFAULT false,
      replied BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create messages indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at)`;

  // Create timeline_events table
  await sql`
    CREATE TABLE IF NOT EXISTS timeline_events (
      id SERIAL PRIMARY KEY,
      title_zh VARCHAR(500) NOT NULL,
      title_en VARCHAR(500),
      description_zh TEXT,
      description_en TEXT,
      date DATE NOT NULL,
      type VARCHAR(50) DEFAULT 'work' CHECK (type IN ('work', 'education', 'achievement')),
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create timeline_events indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_timeline_events_type ON timeline_events(type)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_timeline_events_date ON timeline_events(date)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_timeline_events_sort_order ON timeline_events(sort_order)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_timeline_events_title_zh ON timeline_events(title_zh)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_timeline_events_title_en ON timeline_events(title_en)`;

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
