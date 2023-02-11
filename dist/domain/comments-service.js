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
const models_1 = require("../models/models");
const comments_repository_1 = require("../repositories/comments/comments-repository");
const mongodb_1 = require("mongodb");
const db_1 = require("../repositories/db");
class CommentsService {
    createComment(content, user, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentDb = new models_1.CommentDbModel(new mongodb_1.ObjectId(), content, new Date().toISOString(), {
                userId: user._id.toString(),
                userLogin: user.accountData.login,
            }, [], postId, {
                likesCount: 0,
                dislikesCount: 0,
            });
            yield comments_repository_1.commentsRepository.createComment(commentDb);
            return {
                id: commentDb._id.toString(),
                content: commentDb.content,
                commentatorInfo: {
                    userId: commentDb.commentatorInfo.userId,
                    userLogin: commentDb.commentatorInfo.userLogin
                },
                createdAt: commentDb.createdAt,
                likesInfo: {
                    likesCount: commentDb.likesInfo.likesCount,
                    dislikesCount: commentDb.likesInfo.dislikesCount,
                    myStatus: "None"
                }
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
    likeComment(commentId, likeStatus, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = new mongodb_1.ObjectId(commentId);
            const commentInstance = yield db_1.CommentModelClass.findOne({ _id });
            if (!commentInstance) {
                return false;
            }
            const userId = user._id;
            const userLikedObject = commentInstance.likingUsers.find(user => user.userId.toString() === userId.toString());
            console.log(userLikedObject);
            if (!userLikedObject) {
                commentInstance.likingUsers.push({ userId: userId, myStatus: "None" });
                yield commentInstance.save();
            }
            const indexOfUser = commentInstance.likingUsers.findIndex(user => user.userId.toString() === userId.toString());
            console.log(indexOfUser);
            const myStatus = commentInstance.likingUsers.find(user => user.userId.toString() === userId.toString()).myStatus;
            console.log(myStatus);
            switch (likeStatus) {
                case 'Like':
                    if (myStatus === "Like") {
                        commentInstance.likingUsers[indexOfUser].myStatus = "None";
                        --commentInstance.likesInfo.likesCount;
                    }
                    if (myStatus === "None") {
                        ++commentInstance.likesInfo.likesCount;
                        commentInstance.likingUsers[indexOfUser].myStatus = "Like";
                    }
                    if (myStatus === "Dislike") {
                        --commentInstance.likesInfo.dislikesCount;
                        ++commentInstance.likesInfo.likesCount;
                        commentInstance.likingUsers[indexOfUser].myStatus = "Like";
                    }
                    break;
                case 'Dislike':
                    if (myStatus === "Like") {
                        --commentInstance.likesInfo.likesCount;
                        ++commentInstance.likesInfo.dislikesCount;
                        commentInstance.likingUsers[indexOfUser].myStatus = "Dislike";
                    }
                    if (myStatus === "None") {
                        ++commentInstance.likesInfo.dislikesCount;
                        commentInstance.likingUsers[indexOfUser].myStatus = "Dislike";
                    }
                    if (myStatus === "Dislike") {
                        --commentInstance.likesInfo.dislikesCount;
                        commentInstance.likingUsers[indexOfUser].myStatus = "None";
                    }
                    break;
                case 'None':
                    if (myStatus === "Like") {
                        --commentInstance.likesInfo.likesCount;
                        commentInstance.likingUsers[indexOfUser].myStatus = "None";
                    }
                    if (myStatus === "Dislike") {
                        --commentInstance.likesInfo.dislikesCount;
                        commentInstance.likingUsers[indexOfUser].myStatus = "None";
                    }
                    if (myStatus === "None") {
                        commentInstance.likingUsers[indexOfUser].myStatus = "None";
                    }
                    break;
            }
            yield commentInstance.save();
            return true;
        });
    }
}
exports.commentsService = new CommentsService();
