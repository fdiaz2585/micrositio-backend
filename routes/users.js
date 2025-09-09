import express from 'express';
import bcrypt from 'bcrypt';
import { getDB } from '../db.js';
import { verificarToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Listar usuarios (solo admin/supervisor)
router.get('/', verificarToken, requireRole(['admin', 'supervisor']), async (req, res) => {
  const db = await getDB();
  const users = await db.all('SELECT id, name, email, role FROM users');
  res.json(users);
});

// Crear usuario (solo admin/supervisor)
router.post('/', verificarToken, requireRole(['admin', 'supervisor']), async (req, res) => {
  const { name, email, password, role } = req.body;
  const db = await getDB();
  const hashed = await bcrypt.hash(password, 10);
  try {
    await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      name, email, hashed, role || 'usuario'
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: 'No se pudo crear usuario (email duplicado?)' });
  }
});

// Eliminar usuario (solo admin)
router.delete('/:id', verificarToken, requireRole(['admin']), async (req, res) => {
  const db = await getDB();
  await db.run('DELETE FROM users WHERE id = ?', req.params.id);
  res.json({ ok: true });
});

// Modificar usuario (solo admin/supervisor)
router.put('/:id', verificarToken, requireRole(['admin', 'supervisor']), async (req, res) => {
  const { name, role } = req.body;
  const db = await getDB();
  await db.run('UPDATE users SET name = ?, role = ? WHERE id = ?', name, role, req.params.id);
  res.json({ ok: true });
});

export default router;
