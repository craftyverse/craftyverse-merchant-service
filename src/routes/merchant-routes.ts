import express, { Request, Response } from "express";
import { createMerchantHandler } from "../controllers/create-merchant-handler";

const router = express.Router();

router.get("/healthcheck", (req: Request, res: Response) => {
  res.status(200).json({
    health: "OK",
  });
});

router.post("/createmerchant", createMerchantHandler);

export { router as merchantRouter };
