import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Permite definir la ruta de la BD vía variable de entorno (útil para Render Disks)
const DB_PATH = process.env.DATABASE_PATH || './database.db';

export async function getDB() {
  return open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });
}
