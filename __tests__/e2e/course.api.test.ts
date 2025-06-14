import request from "supertest";
import { app, HTTP_STATUSES } from "../../src/server";

describe("/course", () => {
	beforeAll(async () => {
		await request(app).delete("/__test__/data");
	});

	it("should return 200 and empty array", async () => {
		await request(app).get("/courses").expect(200, []);
	});

	it("should return 404 for not existing course", async () => {
		await request(app).get("/courses/1").expect(404);
	});

	it("should'nt create course with incorrect input data", async () => {
		await request(app).post("/courses").send({ title: "" }).expect(400);
		await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, []);
	});

	let createdCourse: any = null;
	it("should create course with correct input data", async () => {
		const createResponse = await request(app)
			.post("/courses")
			.send({ title: "test" })
			.expect(HTTP_STATUSES.CREATED_201);

		createdCourse = createResponse.body;

		expect(createdCourse).toEqual({
			id: expect.any(Number),
			title: "test",
		});

		await request(app)
			.get("/courses")
			.expect(HTTP_STATUSES.OK_200, [createdCourse]);
	});
});
