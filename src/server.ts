import express, { Request, response, Response } from "express";
import {
	RequestWithBody,
	RequestWithParams,
	RequestWithParamsAndBody,
	RequestWithQuery,
} from "./types";
import { CourseCreateModel } from "./models/CourseCreateModel";
import { CourseUpdateModel } from "./models/CourseUpdateModel";
import { CoursesQueryModel } from "./models/CoursesQueryModel";
import { CourseViewModel } from "./models/CourseViewModel";
import { URIParamsCourseIdModel } from "./models/URIParamsCourseIdModel";
import { setupSwagger, swaggerSpec } from "../swagger";

export const app = express();
const port = 8080;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

interface Course {
	id: number;
	title: string;
	usersCount: number;
}

interface DB {
	courses: Course[];
}

const db: DB = {
	courses: [
		{ id: 1, title: "front-end", usersCount: 10 },
		{ id: 2, title: "back-end", usersCount: 10 },
		{ id: 3, title: "automation qa", usersCount: 10 },
		{ id: 4, title: "devops", usersCount: 10 },
	],
};

export const HTTP_STATUSES = {
	OK_200: 200,
	CREATED_201: 201,
	NO_CONTENT_204: 204,

	BAD_REQUEST_400: 400,
	NOT_FOUND_404: 404,
};

export type HTTP_STATUSES_I = typeof HTTP_STATUSES;

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Получение списка курсов
 *     requestBody:
 *       required: 
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New course"
 *     responses:
 *       200:
 *         description: Данные получены
 */
app.get(
	"/courses",
	(
		req: RequestWithQuery<CoursesQueryModel>,
		res: Response<CourseViewModel[]>
	) => {
		let foundCourses = db.courses;
		if (req.query.title) {
			foundCourses = db.courses.filter((c) =>
				c.title.includes(req.query.title as string)
			);
		}

		res.json(
			foundCourses.map((course) => {
				return {
					id: course.id,
					title: course.title,
				};
			})
		);
	}
);

app.get(
	"/courses/:id",
	(
		req: RequestWithParams<URIParamsCourseIdModel>,
		res: Response<CourseViewModel>
	) => {
		const id = +req.params.id;
		const found = db.courses.find((c) => c.id === id);

		if (!found) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
			return;
		}

		res.json(found);
	}
);

app.post(
	"/courses",
	(req: RequestWithBody<CourseCreateModel>, res: Response<Course>) => {
		if (!req.body.title) {
			res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
			return;
		}

		const createdCourse: Course = {
			id: +new Date(),
			title: req.body.title,
			usersCount: 10,
		};

		db.courses.push(createdCourse);
		res.status(HTTP_STATUSES.CREATED_201).json(createdCourse);
	}
);

app.delete("/courses/:id", (req: Request<URIParamsCourseIdModel>, res: Response) => {
	db.courses = db.courses.filter((c) => c.id !== +req.params.id);
	res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.put(
	"/courses/:id",
	(
		req: RequestWithParamsAndBody<{ id: string }, CourseUpdateModel>,
		res: Response<CourseViewModel>
	) => {
		if (!req.body.title) {
			res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
			return;
		}

		const foundCourse = db.courses.find((c) => c.id === +req.params.id);
		if (!foundCourse) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
			return;
		}

		foundCourse.title = req.body.title;

		res.json(foundCourse);
	}
);

app.delete("/__test__/data", (req: Request, res: Response) => {
	db.courses = [];
	response.sendStatus(HTTP_STATUSES.OK_200);
});

setupSwagger(app);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
