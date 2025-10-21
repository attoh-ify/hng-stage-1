import { Application, Request, Response } from "express";
import { analyzeString, specificString, getAllStringsWithFiltering, naturalLanguageFiltering, deleteString } from "./controller";


export const setupRoutes = (app: Application): void => {
    app.get("/health", (req: Request, res: Response) => {
        res.status(200).json({
            status: "ok",
            timestamp: new Date().toISOString(),
        });
    });

    app.post("/strings", analyzeString);

    app.get("/strings/filter-by-natural-language", naturalLanguageFiltering);
    
    app.get("/strings/:string_value", specificString);
    
    app.get("/strings", getAllStringsWithFiltering);

    app.delete("/strings/:string_value", deleteString);
};
