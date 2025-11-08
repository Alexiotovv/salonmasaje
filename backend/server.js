// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import reviewRoutes from "./src/routes/review.routes.js";

dotenv.config();

// Conectar a MySQL
await sequelize.authenticate()
  .then(() => console.log("✅ Conectado a MySQL"))
  .catch(err => console.error("❌ Error al conectar a MySQL:", err));

// Sincroniza el modelo (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  await sequelize.sync({ alter: true });
}

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando correctamente" });
});

// Rutas de reseñas
app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));