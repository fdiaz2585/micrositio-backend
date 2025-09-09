import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDB } from '../db.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = await getDB();
  const user = await db.get('SELECT * FROM users WHERE email = ?', email);

  if (!user) return res.status(401).json({ error: "Usuario o contraseña incorrectos" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Usuario o contraseña incorrectos" });

  // Generar token JWT
  const token = jwt.sign({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }, process.env.JWT_SECRET, { expiresIn: '8h' });

  res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token
  });
});

export default router;
