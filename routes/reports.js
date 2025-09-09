// backend/routes/reports.js
import express from 'express';
import { getDB } from '../db.js';
import { verificarToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET - listar todos los reportes (visible según rol del usuario)
router.get('/', verificarToken, async (req, res) => {
  const db = await getDB();
  const userRole = req.usuario.role;
  const rows = await db.all(
    `SELECT * FROM reports WHERE
      (rol_minimo = 'usuario')
      OR (rol_minimo = 'supervisor' AND (? = 'supervisor' OR ? = 'admin'))
      OR (rol_minimo = 'admin' AND ? = 'admin')`,
    userRole, userRole, userRole
  );
  res.json({ reports: rows });
});

// POST - crear nuevo reporte (solo admin/supervisor)
router.post('/', verificarToken, requireRole(['admin', 'supervisor']), async (req, res) => {
  const { name, url, descripcion, rol_minimo } = req.body;
  if (!name || !url) return res.status(400).json({ error: "Faltan datos obligatorios" });
  const db = await getDB();
  const result = await db.run(
    `INSERT INTO reports (name, url, descripcion, rol_minimo)
     VALUES (?, ?, ?, ?)`,
    name, url, descripcion || '', rol_minimo || 'usuario'
  );
  const newReport = await db.get(`SELECT * FROM reports WHERE id = ?`, result.lastID);
  res.json({ report: newReport });
});

// PUT - editar reporte (solo admin/supervisor)
router.put('/:id', verificarToken, requireRole(['admin', 'supervisor']), async (req, res) => {
  const { id } = req.params;
  const { name, url, descripcion, rol_minimo } = req.body;
  const db = await getDB();
  await db.run(
    `UPDATE reports SET name = ?, url = ?, descripcion = ?, rol_minimo = ? WHERE id = ?`,
    name, url, descripcion || '', rol_minimo || 'usuario', id
  );
  const updated = await db.get(`SELECT * FROM reports WHERE id = ?`, id);
  res.json({ report: updated });
});

// DELETE - eliminar reporte (solo admin/supervisor)
router.delete('/:id', verificarToken, requireRole(['admin', 'supervisor']), async (req, res) => {
  const { id } = req.params;
  const db = await getDB();
  await db.run(`DELETE FROM reports WHERE id = ?`, id);
  res.json({ msg: "Reporte eliminado" });
});

export default router;
