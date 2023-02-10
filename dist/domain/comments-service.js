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
exports.commentsService = void 0;
const comments_repository_1 = require("../repositories/comments/comments-repository");
const mongodb_1 = require("mongodb");
class CommentsService {
    createComment(content, user, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentDb = {
                _id: new mongodb_1.ObjectId(),
                content: content,
                createdAt: new Date().toISOString(),
                userId: user._id.toString(),
                userLogin: user.accountData.login,
                postId: postId
            };
            yield comments_repository_1.commentsRepository.createComment(commentDb);
            return {
                id: commentDb._id.toString(),
                content: commentDb.content,
                userId: commentDb.userId,
                userLogin: commentDb.userLogin,
                createdAt: commentDb.createdAt
            };
        });
    }
    updateCommentById(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_repository_1.commentsRepository.updateComment(id, content);
        });
    }
    deleteCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_repository_1.commentsRepository.deleteComment(id);
        });
    }
}
exports.commentsService = new CommentsService();
