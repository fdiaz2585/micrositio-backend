// backend/initReportsTable.js
import { getDB } from './db.js';

const db = await getDB();
await db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    descripcion TEXT,
    rol_minimo TEXT DEFAULT 'usuario'
  );
`);
console.log('Tabla reports creada');
process.exit();
