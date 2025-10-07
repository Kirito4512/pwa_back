import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

// importar rutas
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// rutas
app.get('/', (req, res) => res.json({ ok: true, name: 'TODO-PWA-API' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const { PORT = 4000, MONGO_URI } = process.env;

// Conectar a MongoDB y levantar servidor
mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`Server listening on http://0.0.0.0:${PORT}`)
    );
  })
  .catch(err => {
    console.error("Error al conectar a la base de datos", err);
    process.exit(1);
  });
