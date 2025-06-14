import express from "express";
import { setupSwagger } from "../swagger";
import { getCoursesRouter } from "./routes/courses";
import { db } from "./db/db";
import { getTestsRouter } from "./routes/tests";

export const app = express();

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.use('/courses', getCoursesRouter(db));
app.use('/__test__', getTestsRouter(db));

setupSwagger(app);