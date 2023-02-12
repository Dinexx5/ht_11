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
exports.postsControllerInstance = exports.postsRouter = void 0;
const express_1 = require("express");
const input_validation_1 = require("../middlewares/input-validation");
const posts_service_1 = require("../domain/posts-service");
const posts_query_repository_1 = require("../repositories/posts/posts-query-repository");
const comments_service_1 = require("../domain/comments-service");
const comments_query_repository_1 = require("../repositories/comments/comments-query-repository");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
exports.postsRouter = (0, express_1.Router)({});
class PostsController {
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const returnedPosts = yield posts_query_repository_1.postsQueryRepository.getAllPosts(req.query);
            return res.status(200).send(returnedPosts);
        });
    }
    getPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundPost = yield posts_query_repository_1.postsQueryRepository.findPostById(req.params.id);
            if (!foundPost) {
                return res.sendStatus(404);
            }
            return res.send(foundPost);
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = yield posts_service_1.postsService.createPost(req.body);
            return res.status(201).send(newPost);
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeleted = yield posts_service_1.postsService.deletePostById(req.params.id);
            if (!isDeleted) {
                return res.sendStatus(404);
            }
            return res.sendStatus(204);
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let isUpdated = yield posts_service_1.postsService.UpdatePostById(req.params.id, req.body);
            if (!isUpdated) {
                return res.sendStatus(404);
            }
            return res.sendStatus(204);
        });
    }
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield posts_query_repository_1.postsQueryRepository.findPostById(req.params.id);
            if (!foundPost) {
                return res.sendStatus(404);
            }
            const newComment = yield comments_service_1.commentsService.createComment(req.body.content, req.user, req.params.id);
            return res.status(201).send(newComment);
        });
    }
    getComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield posts_query_repository_1.postsQueryRepository.findPostById(req.params.id);
            if (!foundPost) {
                return res.sendStatus(404);
            }
            const user = req.user;
            if (!user) {
                const returnedComments = yield comments_query_repository_1.commentsQueryRepository.getAllCommentsForPost(req.query, req.params.id);
                if (!returnedComments) {
                    return res.sendStatus(404);
                }
                return res.send(returnedComments);
            }
            const returnedComments = yield comments_query_repository_1.commentsQueryRepository.getAllCommentsForPost(req.query, req.params.id, user);
            return res.send(returnedComments);
        });
    }
}
exports.postsControllerInstance = new PostsController();
exports.postsRouter.get('/', exports.postsControllerInstance.getPosts.bind(exports.postsControllerInstance));
exports.postsRouter.get('/:id', input_validation_1.objectIdIsValidMiddleware, exports.postsControllerInstance.getPost.bind(exports.postsControllerInstance));
exports.postsRouter.post('/', auth_middlewares_1.basicAuthMiddleware, input_validation_1.titleValidation, input_validation_1.shortDescriptionValidation, input_validation_1.postContentValidation, input_validation_1.blogIdlValidation, input_validation_1.inputValidationMiddleware, exports.postsControllerInstance.createPost.bind(exports.postsControllerInstance));
exports.postsRouter.delete('/:id', auth_middlewares_1.basicAuthMiddleware, input_validation_1.objectIdIsValidMiddleware, exports.postsControllerInstance.deletePost.bind(exports.postsControllerInstance));
exports.postsRouter.put('/:id', auth_middlewares_1.basicAuthMiddleware, input_validation_1.objectIdIsValidMiddleware, input_validation_1.titleValidation, input_validation_1.shortDescriptionValidation, input_validation_1.postContentValidation, input_validation_1.blogIdlValidation, input_validation_1.inputValidationMiddleware, exports.postsControllerInstance.updatePost.bind(exports.postsControllerInstance));
exports.postsRouter.post('/:id/comments', auth_middlewares_1.bearerAuthMiddleware, input_validation_1.commentContentValidation, input_validation_1.inputValidationMiddleware, exports.postsControllerInstance.createComment.bind(exports.postsControllerInstance));
exports.postsRouter.get('/:id/comments', auth_middlewares_1.getCommentAuthMiddleware, exports.postsControllerInstance.getComments.bind(exports.postsControllerInstance));
