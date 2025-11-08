import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import turnoRoutes from "./src/routes/turnos.js"; // ✅ tu única ruta

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta base para probar
app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando correctamente" });
});

// 👇 Montas la ruta principal
app.use("/api/turnos", turnoRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
