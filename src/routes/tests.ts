import express, { Request, Response } from "express";
import { DB, HTTP_STATUSES } from "../db/db";

export const getTestsRouter = (db: DB) => {
    const testsRouter = express.Router();

	testsRouter.delete("/data", (req: Request, res: Response) => {
		db.courses = [];
		res.sendStatus(HTTP_STATUSES.OK_200);
	});

    return testsRouter;
};
