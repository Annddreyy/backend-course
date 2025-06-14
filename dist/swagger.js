"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
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
const options = {
    definition: swaggerDefination,
    apis: ["./src/server.ts"],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(exports.swaggerSpec));
};
exports.setupSwagger = setupSwagger;
