import bcrypt from 'bcrypt';
import { getDB } from './db.js';

const email = "admin@micrositio.com";
const name = "Administrador";
const password = "admin123";

async function crearAdmin() {
  const db = await getDB();

  // crear tabla si no existe
  await db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

  const hashed = await bcrypt.hash(password, 10);

  // upsert admin
  await db.run(
    `INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    name, email, hashed, 'admin'
  );

  console.log(`Admin creado: ${email} / ${password}`);
  process.exit();
}
crearAdmin();
