import type { NextFunction, Request, Response } from "express";

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    console.error("Erreur :", err);

    if (err instanceof SyntaxError) {
        res.status(400).json({
            erreur: "JSON invalide"
        });
        return;
    }

    if (err instanceof Error) {
        res.status(500).json({
            erreur: err.message
        });
        return;
    }

    res.status(500).json({
        erreur: "Erreur interne du serveur"
    });
}