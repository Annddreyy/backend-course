import { db } from "../db/db";

export const coursesRepository = {
	getCourses(title: string) {
		let foundCourses = db.courses;

		if (title) {
			foundCourses = db.courses.filter((c) => c.title.includes(title));
		}

		return foundCourses;
	},
};
