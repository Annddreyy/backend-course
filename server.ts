import express, { Request, Response} from "express";
const app = express();
const port = 8080;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

const db = {
	courses: [
		{ id: 1, title: "front-end" },
		{ id: 2, title: "back-end" },
		{ id: 3, title: "automation qa" },
		{ id: 4, title: "devops" },
	],
};

const HTTP_STATUSES = {
	OK_200: 200,
	CREATED_201: 201,
	NO_CONTENT_204: 204,

	BAD_REQUEST_400: 400,
	NOT_FOUND_404: 404,
}

app.get("/courses", (req: Request, res: Response) => {
	let foundCourses = db.courses;
	if (req.query.title) {
		foundCourses = db.courses.filter((c) =>
			c.title.includes(req.query.title as string)
		);
	}
	res.json(foundCourses);
});

app.get("/courses/:id", (req: Request, res: Response) => {
	const id = +req.params.id;
	const found = db.courses.find((c) => c.id === id);

	if (!found) {
		res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
		return;
	}

	res.json(found);
});

app.delete("/courses/:id", (req: Request, res: Response) => {
	db.courses = db.courses.filter((c) => c.id !== +req.params.id);
	res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.post("/courses", (req: Request, res: Response) => {
	console.log(req.body);
	const createdCourse = {
		id: +new Date(),
		title: req.body.title,
	};

	db.courses.push(createdCourse);
	res.status(HTTP_STATUSES.CREATED_201).json(createdCourse);
});

app.put("/courses/:id", (req: Request, res: Response) => {
	if (!req.body.title) {
		res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
		return;
	}

	const foundCourse = db.courses.find(c => c.id === +req.params.id);
	if (!foundCourse) {
		res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
		return;
	}

	foundCourse.title = req.body.title;

	res.json(foundCourse);
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
