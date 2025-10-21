import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { setupRoutes } from "./api/route";
import limiter from "./middleware/rate-limiter";
import { initDb } from "./api/db";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        const app = express();

        app.use(cors());

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.use(limiter);

        initDb();
        
        setupRoutes(app);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}...`);
        });
    } catch {
        process.exit(1);
    };
};

startServer();
