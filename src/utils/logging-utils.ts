import { Request } from "express";
import { logEvents } from "../middleware/log-events";
import { ZodIssue } from "zod";

export class LoggingUtils {
  static async logEvent(
    request: Request | undefined,
    message: string | ZodIssue[],
    file: string
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
}
