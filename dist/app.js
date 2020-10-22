"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv/config");
class App {
    constructor(controllers, port) {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.mongoConnect();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }
    initializeMiddlewares() {
        this.app.use(bodyParser.json());
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
    mongoConnect() {
        mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
        console.log(`Databae is connected...`);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}
exports.default = App;
