import { Request } from "express";
import { logEvents } from "../middleware/log-events";
import { ZodIssue } from "zod";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export class LoggingUtils {
  static async logEvent(
    message: string | ZodIssue[],
    file: string,
    request?: Request | undefined
  ) {
    if (!request) {
      logEvents(`${message}`, file);
    } else {
      logEvents(
        `${request.method}\t${request.headers.origin}\t${
          request.url
        }\t${JSON.stringify(message)}`,
        file
      );
    }
  }

  static readErrorLog = (
    errorLogPath: string,
    errorString: string
  ): boolean => {
    console.log(errorLogPath);
    const logFilePath = path.resolve(__dirname, errorLogPath);
    const errorLog = fs.readFileSync(logFilePath, "utf8");
    return errorLog.includes(errorString);
  };
}
