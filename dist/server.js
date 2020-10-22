"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const posts_controller_1 = require("./posts/posts.controller");
const app = new app_1.default([
    new posts_controller_1.default(),
], 3002);
app.listen();
