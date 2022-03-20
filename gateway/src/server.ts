import { CustomError } from "@shared/errors";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import helmet from "helmet";
import StatusCodes from "http-status-codes";
import logger from "jet-logger";
import morgan from "morgan";
import { connectDB } from "./config/db.config";
import { redisClient } from "./config/redis.config";
import apiRouter from "./routes/api";

// Constants
const app = express();
config();

/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/

// Common middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

// Authentication

/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/

// healthcheck route
app.use("/ping", (req, res) => {
  res.status(200).send("PONG");
});

// Add api router
app.use("/v1/api", apiRouter);

// Error handling
app.use(
  (err: Error | CustomError, _: Request, res: Response, __: NextFunction) => {
    logger.err(err, true);
    const status =
      err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST;
    return res.status(status).json({
      error: err.message,
    });
  }
);

/***********************************************************************************
 *                         Database and cache
 **********************************************************************************/

(async () => {
  try {
    const conn = await connectDB();
    if (conn) {
      const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

      const url = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
      logger.info(`Connected to mongoDB @ ${url}`);
    }
  } catch (err) {
    logger.err("Could not connect to MongoDB:: " + err.message);
  }
})();

(async () => {
  await redisClient.connect();
})();

// Export here and start in a diff file (for testing).
export default app;
