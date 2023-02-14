"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsControllerInstance = exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_service_1 = require("../domain/blogs-service");
const input_validation_1 = require("../middlewares/input-validation");
const blogs_query_repository_1 = require("../repositories/blogs/blogs-query-repository");
const posts_service_1 = require("../domain/posts-service");
const posts_query_repository_1 = require("../repositories/posts/posts-query-repository");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
exports.blogsRouter = (0, express_1.Router)({});
class BlogsController {
    constructor() {
        this.blogsService = new blogs_service_1.BlogsService;
    }
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const returnedBlogs = yield blogs_query_repository_1.blogsQueryRepository.getAllBlogs(req.query);
            res.send(returnedBlogs);
        });
    }
    getBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(req.params.id);
            if (!blog) {
                return res.sendStatus(404);
            }
            res.send(blog);
        });
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = yield this.blogsService.createBlog(req.body);
            res.status(201).send(newBlog);
        });
    }
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let isUpdated = yield this.blogsService.UpdateBlogById(req.params.id, req.body);
            if (!isUpdated) {
                return res.sendStatus(404);
            }
            return res.sendStatus(204);
        });
    }
    deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeleted = yield this.blogsService.deleteBlogById(req.params.id);
            if (!isDeleted) {
                return res.sendStatus(404);
            }
            return res.sendStatus(204);
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogId = req.params.id;
            const postBody = Object.assign(Object.assign({}, req.body), { blogId });
            const newPost = yield posts_service_1.postsService.createPost(postBody);
            res.status(201).send(newPost);
        });
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPosts = yield posts_query_repository_1.postsQueryRepository.getAllPosts(req.query, req.params.id, req.user);
            res.send(foundPosts);
        });
    }
}
exports.blogsControllerInstance = new BlogsController();
exports.blogsRouter.get('/', exports.blogsControllerInstance.getBlogs.bind(exports.blogsControllerInstance));
exports.blogsRouter.get('/:id', input_validation_1.objectIdIsValidMiddleware, exports.blogsControllerInstance.getBlog.bind(exports.blogsControllerInstance));
exports.blogsRouter.get('/:id/posts', auth_middlewares_1.authUserToGetLikeStatus, input_validation_1.objectIdIsValidMiddleware, input_validation_1.blogIdParamsValidation, exports.blogsControllerInstance.getPosts.bind(exports.blogsControllerInstance));
exports.blogsRouter.post('/:id/posts', auth_middlewares_1.basicAuthMiddleware, input_validation_1.titleValidation, input_validation_1.shortDescriptionValidation, input_validation_1.postContentValidation, input_validation_1.inputValidationMiddleware, input_validation_1.blogIdParamsValidation, exports.blogsControllerInstance.createPost.bind(exports.blogsControllerInstance));
exports.blogsRouter.post('/', auth_middlewares_1.basicAuthMiddleware, input_validation_1.nameValidation, input_validation_1.descriptionValidation, input_validation_1.websiteUrlValidation, input_validation_1.inputValidationMiddleware, exports.blogsControllerInstance.createBlog.bind(exports.blogsControllerInstance));
exports.blogsRouter.delete('/:id', auth_middlewares_1.basicAuthMiddleware, input_validation_1.objectIdIsValidMiddleware, exports.blogsControllerInstance.deleteBlog.bind(exports.blogsControllerInstance));
exports.blogsRouter.put('/:id', auth_middlewares_1.basicAuthMiddleware, input_validation_1.objectIdIsValidMiddleware, input_validation_1.nameValidation, input_validation_1.descriptionValidation, input_validation_1.websiteUrlValidation, input_validation_1.inputValidationMiddleware, exports.blogsControllerInstance.updateBlog.bind(exports.blogsControllerInstance));
