import express, { ErrorRequestHandler } from "express";
import { corsOptions } from "../config/cors-options";

import {
  NotFoundError,
  errorHandler,
} from "@craftyverse-au/craftyverse-common";
import { logger } from "./middleware/log-events";
import { credentials } from "./middleware/credentials";
import cors from "cors";
import cookieParser from "cookie-parser";
import { merchantRouter } from "./routes/merchant-routes";

const app = express();

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/merchant", merchantRouter);

app.all("*", () => {
  const message = "The route that you have requested does not exist";
  throw new NotFoundError(message);
});
app.use(errorHandler as ErrorRequestHandler);

export { app };
