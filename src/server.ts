import express from "express";
import cors from "cors";
import produitsRouter from "./routes/produits.js";
import { verifierConnexion } from "./db.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", async (_req, res) => {
    const ok = await verifierConnexion();

    if (ok) {
        res.status(200).json({ statut: "ok" });
    } else {
        res.status(503).json({ statut: "erreur" });
    }
});

app.use("/api/produits", produitsRouter);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});