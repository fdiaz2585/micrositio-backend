// backend/routes/userReports.js
import express from 'express';
import { verificarToken, requireRole } from '../middleware/auth.js';
import { getDB } from '../db.js';

const router = express.Router();

// Obtener reportes asignados a un usuario
router.get('/:userId/reports', verificarToken, requireRole(['admin', 'supervisor']), async (req, res) => {
  const db = await getDB();
  const userId = req.params.userId;
  const reports = await db.all(
    `SELECT r.* FROM reports r
     JOIN user_reports ur ON r.id = ur.report_id
     WHERE ur.user_id = ?`, [userId]
  );
  res.json({ reports });
});

// Asignar un reporte a un usuario
router.post('/:userId/reports', verificarToken, requireRole(['admin', 'supervisor']), async (req, res) => {
  const db = await getDB();
  const { report_id } = req.body;
  const userId = req.params.userId;
  // Evitar duplicados
  const existe = await db.get(`SELECT 1 FROM user_reports WHERE user_id = ? AND report_id = ?`, [userId, report_id]);
  if (existe) return res.status(400).json({ error: 'Ya asignado' });
  await db.run(`INSERT INTO user_reports (user_id, report_id) VALUES (?, ?)`, [userId, report_id]);
  res.json({ success: true });
});

// Quitar un reporte a un usuario
router.delete('/:userId/reports/:reportId', verificarToken, requireRole(['admin', 'supervisor']), async (req, res) => {
  const db = await getDB();
  const { userId, reportId } = req.params;
  await db.run(`DELETE FROM user_reports WHERE user_id = ? AND report_id = ?`, [userId, reportId]);
  res.json({ success: true });
});

export default router;
