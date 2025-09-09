import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import usuariosRoutes from './routes/users.js'; // <-- este es tu archivo de rutas de usuarios

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://micrositiolubriagsa.netlify.app'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usuariosRoutes);

app.get('/', (req, res) => {
  res.json({ msg: "Backend micrositio PowerBI funcionando." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Backend listo en http://localhost:${PORT}`)
);
