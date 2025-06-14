import { Course, DB, HTTP_STATUSES } from "../db/db";
import { CourseCreateModel } from "../models/CourseCreateModel";
import { CoursesQueryModel } from "../models/CoursesQueryModel";
import { CourseUpdateModel } from "../models/CourseUpdateModel";
import { CourseViewModel } from "../models/CourseViewModel";
import { URIParamsCourseIdModel } from "../models/URIParamsCourseIdModel";
import { coursesRepository } from "../repositories/coursesRepository";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from "../types";
import express, { Response, Request } from "express";


export const getCoursesRouter = (db: DB) => {
    const coursesRouter = express.Router();

    coursesRouter.get(
        "/",
        (
            req: RequestWithQuery<CoursesQueryModel>,
            res: Response<CourseViewModel[]>
        ) => {
            const foundCourses = coursesRepository.getCourses(req.query.title);
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
    
    coursesRouter.get(
        "/:id",
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
    
    coursesRouter.post(
        "/",
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
    
    coursesRouter.delete("/:id", (req: Request<URIParamsCourseIdModel>, res: Response) => {
        db.courses = db.courses.filter((c) => c.id !== +req.params.id);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });
    
    coursesRouter.put(
        "/:id",
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

    return coursesRouter;
}