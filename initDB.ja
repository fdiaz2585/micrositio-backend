import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';

async function setup() {
  const db = await open({ filename: './database.sqlite', driver: sqlite3.Database });
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

  // Usuario admin demo
  const hashed = await bcrypt.hash('admin123', 10);
  await db.run('INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
    'Admin', 'admin@micrositio.com', hashed, 'admin'
  ]);

  console.log('DB creada y usuario admin listo');
  await db.close();
}
setup();
