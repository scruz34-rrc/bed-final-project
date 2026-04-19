import express, { Express } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

dotenv.config();

import teamRoutes from "./api/v1/routes/teamRoutes";
import playerRoutes from "./api/v1/routes/playerRoutes";
import statRoutes from "./api/v1/routes/statRoutes";
import setupSwagger from "../config/swagger";
import errorHandler from "./api/v1/middleware/errorHandler";
import adminRoutes from "./api/v1/routes/adminRoutes";

const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/players", playerRoutes);
app.use("/api/v1/stats", statRoutes);
app.use("/api/v1/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

app.use(errorHandler);

export default app;