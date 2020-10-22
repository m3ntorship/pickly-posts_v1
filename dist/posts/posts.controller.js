"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class PostsController {
    constructor() {
        this.path = '/posts';
        this.router = express.Router();
        this.posts = [
            {
                author: 'asdasd',
                caption: 'this is caption',
                isAnonymous: 'false'
            }
        ];
        this.getAllPosts = (req, res) => {
            res.send(this.posts);
        };
        this.createPost = (req, res) => {
            const post = req.body;
            this.posts.push(post);
            res.send(post);
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.post(this.path, this.createPost);
    }
}
exports.default = PostsController;
