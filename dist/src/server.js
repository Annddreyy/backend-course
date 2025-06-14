"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUSES = exports.app = void 0;
const express_1 = __importStar(require("express"));
const swagger_1 = require("../swagger");
exports.app = (0, express_1.default)();
const port = 8080;
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
const db = {
    courses: [
        { id: 1, title: "front-end", usersCount: 10 },
        { id: 2, title: "back-end", usersCount: 10 },
        { id: 3, title: "automation qa", usersCount: 10 },
        { id: 4, title: "devops", usersCount: 10 },
    ],
};
exports.HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
};
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
exports.app.get("/courses", (req, res) => {
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
exports.app.get("/courses/:id", (req, res) => {
    const id = +req.params.id;
    const found = db.courses.find((c) => c.id === id);
    if (!found) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(found);
});
exports.app.post("/courses", (req, res) => {
    if (!req.body.title) {
        res.sendStatus(exports.HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const createdCourse = {
        id: +new Date(),
        title: req.body.title,
        usersCount: 10,
    };
    db.courses.push(createdCourse);
    res.status(exports.HTTP_STATUSES.CREATED_201).json(createdCourse);
});
exports.app.delete("/courses/:id", (req, res) => {
    db.courses = db.courses.filter((c) => c.id !== +req.params.id);
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.put("/courses/:id", (req, res) => {
    if (!req.body.title) {
        res.sendStatus(exports.HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const foundCourse = db.courses.find((c) => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    foundCourse.title = req.body.title;
    res.json(foundCourse);
});
exports.app.delete("/__test__/data", (req, res) => {
    db.courses = [];
    express_1.response.sendStatus(exports.HTTP_STATUSES.OK_200);
});
(0, swagger_1.setupSwagger)(exports.app);
exports.app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
