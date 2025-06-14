"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCoursesRoutes = void 0;
const server_1 = require("../server");
const addCoursesRoutes = (app) => {
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
    app.get("/courses", (req, res) => {
        let foundCourses = db.courses;
        if (req.query.title) {
            foundCourses = db.courses.filter((c) => c.title.includes(req.query.title));
        }
        res.json(foundCourses.map((course) => {
            return {
                id: course.id,
                title: course.title,
            };
        }));
    });
    app.get("/courses/:id", (req, res) => {
        const id = +req.params.id;
        const found = db.courses.find((c) => c.id === id);
        if (!found) {
            res.sendStatus(server_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.json(found);
    });
    app.post("/courses", (req, res) => {
        if (!req.body.title) {
            res.sendStatus(server_1.HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        const createdCourse = {
            id: +new Date(),
            title: req.body.title,
            usersCount: 10,
        };
        db.courses.push(createdCourse);
        res.status(server_1.HTTP_STATUSES.CREATED_201).json(createdCourse);
    });
    app.delete("/courses/:id", (req, res) => {
        db.courses = db.courses.filter((c) => c.id !== +req.params.id);
        res.sendStatus(server_1.HTTP_STATUSES.NO_CONTENT_204);
    });
    app.put("/courses/:id", (req, res) => {
        if (!req.body.title) {
            res.sendStatus(server_1.HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        const foundCourse = db.courses.find((c) => c.id === +req.params.id);
        if (!foundCourse) {
            res.sendStatus(server_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        foundCourse.title = req.body.title;
        res.json(foundCourse);
    });
};
exports.addCoursesRoutes = addCoursesRoutes;
