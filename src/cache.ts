import "dotenv/config";
import { createClient } from "redis";

const client = createClient({
    url: process.env.REDIS_URL
});

client.on("error", erreur => {
    console.error("Erreur Redis :", erreur);
});

await client.connect();

console.log("Redis connecté :", client.isReady);

export type SourceCache = "hit" | "miss" | "bypass";

export async function lireCache<T>(
    cle: string
): Promise<T | null> {
    try {
        if (!client.isReady) {
            return null;
        }

        const valeur = await client.get(cle);

        if (valeur === null) {
            return null;
        }

        return JSON.parse(valeur) as T;
    } catch {
        return null;
    }
}

export async function mettreEnCache<T>(
    cle: string,
    valeur: T,
    ttlSec: number = 60
): Promise<void> {
    try {
        if (!client.isReady) {
            return;
        }

        await client.setEx(
            cle,
            ttlSec,
            JSON.stringify(valeur)
        );
    } catch (erreur) {
        console.error("Erreur lors de la mise en cache :", erreur);
    }
}

export async function purgerCache(
    cle: string
): Promise<void> {
    try {
        if (!client.isReady) {
            return;
        }

        await client.del(cle);
    } catch {
        // Redis ne doit pas faire planter l'API.
    }
}

export async function avecCache<T>(
    cle: string,
    ttlSec: number,
    charger: () => Promise<T>
): Promise<{ valeur: T; cache: SourceCache }> {

    if (!client.isReady) {
        const valeur = await charger();

        return {
            valeur,
            cache: "bypass"
        };
    }

    const valeurCache = await lireCache<T>(cle);

    if (valeurCache !== null) {
        return {
            valeur: valeurCache,
            cache: "hit"
        };
    }

    const valeur = await charger();

    await mettreEnCache(cle, valeur, ttlSec);

    return {
        valeur,
        cache: "miss"
    };
}