// initReports.js
import { getDB } from './db.js';

(async () => {
  const db = await getDB();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      descripcion TEXT,
      rol_minimo TEXT DEFAULT 'usuario' -- admin, supervisor, usuario
    );
  `);
  console.log('Tabla "reports" creada (o ya existe)');
  process.exit(0);
})();
