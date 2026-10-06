import { Router } from "express";
import {
    listeProduits,
    produitParId,
    creerProduit,
    remplacerProduitController,
    supprimerProduitController
} from "../controllers/produitsController.js";

const router = Router();

router.get("/", listeProduits);
router.get("/:id", produitParId);
router.post("/", creerProduit);
router.put("/:id", remplacerProduitController);
router.delete("/:id", supprimerProduitController);

export default router;