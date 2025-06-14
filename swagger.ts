import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerDefination = {
	openapi: "3.0.0",
	info: {
		title: "Backend Course API",
		version: "1.0.0",
		description: "Документация API с использованием Swagger",
	},
	servers: [
		{
			url: "http://localhost:8080",
		},
	],
};

const options: swaggerJSDoc.Options = {
	definition: swaggerDefination,
	apis: ["./src/server.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
export const setupSwagger = (app: Express) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
