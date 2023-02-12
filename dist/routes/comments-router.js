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
exports.commentsControllerInstance = exports.commentsRouter = void 0;
const express_1 = require("express");
const comments_service_1 = require("../domain/comments-service");
const comments_query_repository_1 = require("../repositories/comments/comments-query-repository");
const input_validation_1 = require("../middlewares/input-validation");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
exports.commentsRouter = (0, express_1.Router)({});
class CommentsController {
    getComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            if (!user) {
                const returnedComment = yield comments_query_repository_1.commentsQueryRepository.findCommentById(req.params.id);
                if (!returnedComment) {
                    return res.sendStatus(404);
                }
                return res.send(returnedComment);
            }
            const returnedComment = yield comments_query_repository_1.commentsQueryRepository.findCommentById(req.params.id, req.user);
            if (!returnedComment) {
                return res.sendStatus(404);
            }
            return res.send(returnedComment);
        });
    }
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comments_query_repository_1.commentsQueryRepository.findCommentById(req.params.id, req.user);
            if (!comment) {
                return res.sendStatus(404);
            }
            if (comment.commentatorInfo.userId !== req.user._id.toString()) {
                return res.sendStatus(403);
            }
            const isUpdated = yield comments_service_1.commentsService.updateCommentById(req.params.id, req.body.content);
            if (!isUpdated) {
                return res.sendStatus(404);
            }
            return res.sendStatus(204);
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comments_query_repository_1.commentsQueryRepository.findCommentById(req.params.id, req.user);
            if (!comment) {
                return res.sendStatus(404);
            }
            if (comment.commentatorInfo.userId !== req.user._id.toString()) {
                return res.sendStatus(403);
            }
            const isDeleted = yield comments_service_1.commentsService.deleteCommentById(req.params.id);
            if (!isDeleted) {
                return res.sendStatus(404);
            }
            return res.sendStatus(204);
        });
    }
    likeComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isLiked = yield comments_service_1.commentsService.likeComment(req.params.id, req.body.likeStatus, req.user);
            if (!isLiked) {
                return res.sendStatus(404);
            }
            return res.sendStatus(204);
        });
    }
}
exports.commentsControllerInstance = new CommentsController();
exports.commentsRouter.get('/:id', auth_middlewares_1.getCommentAuthMiddleware, input_validation_1.objectIdIsValidMiddleware, exports.commentsControllerInstance.getComment.bind(exports.commentsControllerInstance));
exports.commentsRouter.put('/:id', auth_middlewares_1.bearerAuthMiddleware, input_validation_1.objectIdIsValidMiddleware, input_validation_1.commentContentValidation, input_validation_1.inputValidationMiddleware, exports.commentsControllerInstance.updateComment.bind(exports.commentsControllerInstance));
exports.commentsRouter.delete('/:id', auth_middlewares_1.bearerAuthMiddleware, input_validation_1.objectIdIsValidMiddleware, exports.commentsControllerInstance.deleteComment.bind(exports.commentsControllerInstance));
exports.commentsRouter.put('/:id/like-status', auth_middlewares_1.bearerAuthMiddleware, input_validation_1.objectIdIsValidMiddleware, input_validation_1.isLikeStatusCorrect, input_validation_1.inputValidationMiddleware, exports.commentsControllerInstance.likeComment.bind(exports.commentsControllerInstance));
