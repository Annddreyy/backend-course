"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = 8080;
app_1.app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
