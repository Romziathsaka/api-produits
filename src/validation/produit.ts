import { NouveauProduit } from "../models/produit.js";

export type ResultatValidation =
    | { valide: true; donnees: NouveauProduit }
    | { valide: false; erreurs: string[] };

export function validerProduit(corps: unknown): ResultatValidation {
    const erreurs: string[] = [];

    if (typeof corps !== "object" || corps === null) {
        return {
            valide: false,
            erreurs: ["Le corps doit être un objet."]
        };
    }

    const donnees = corps as Record<string, unknown>;

    const nom = donnees.nom;
    const prix = donnees.prix;
    const stock = donnees.stock;
    const categorie = donnees.categorie;

    if (typeof nom !== "string" || nom.trim() === "") {
        erreurs.push("Le nom est obligatoire.");
    }

    if (typeof prix !== "number" || prix <= 0) {
        erreurs.push("Le prix doit être un nombre supérieur à 0.");
    }

    if (!Number.isInteger(stock) || typeof stock !== "number" || stock < 0) {
        erreurs.push("Le stock doit être un entier supérieur ou égal à 0.");
    }

    if (typeof categorie !== "string" || categorie.trim() === "") {
        erreurs.push("La catégorie est obligatoire.");
    }

    if (erreurs.length > 0) {
        return {
            valide: false,
            erreurs
        };
    }

    // À partir d'ici, les quatre valeurs ont été validées.
    const nomValide = nom as string;
    const prixValide = prix as number;
    const stockValide = stock as number;
    const categorieValide = categorie as string;

    return {
        valide: true,
        donnees: {
            nom: nomValide.trim(),
            prix: prixValide,
            stock: stockValide,
            categorie: categorieValide.trim()
        }
    };
}