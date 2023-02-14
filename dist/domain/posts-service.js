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
exports.postsService = exports.PostsService = void 0;
const posts_repository_db_1 = require("../repositories/posts/posts-repository-db");
const models_1 = require("../models/models");
const mongodb_1 = require("mongodb");
const blogs_query_repository_1 = require("../repositories/blogs/blogs-query-repository");
const db_1 = require("../repositories/db");
class PostsService {
    constructor() {
        this.postsRepository = new posts_repository_db_1.PostsRepository();
    }
    createPost(postBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, shortDescription, content, blogId } = postBody;
            let foundBlog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(blogId);
            const newDbPost = new models_1.PostDbModel(new mongodb_1.ObjectId(), title, shortDescription, content, blogId, foundBlog.name, foundBlog.createdAt, [], [], {
                likesCount: 0,
                dislikesCount: 0,
            });
            yield this.postsRepository.createPost(newDbPost);
            return {
                id: newDbPost._id.toString(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: foundBlog.name,
                createdAt: foundBlog.createdAt,
                extendedLikesInfo: {
                    likesCount: newDbPost.extendedLikesInfo.likesCount,
                    dislikesCount: newDbPost.extendedLikesInfo.dislikesCount,
                    myStatus: "None",
                    newestLikes: []
                }
            };
        });
    }
    deletePostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.deletePostById(postId);
        });
    }
    UpdatePostById(postId, postBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.UpdatePostById(postId, postBody);
        });
    }
    likePost(postId, likeStatus, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = new mongodb_1.ObjectId(postId);
            const postInstance = yield db_1.PostModelClass.findOne({ _id });
            if (!postInstance) {
                return false;
            }
            const userId = user._id;
            const login = user.accountData.login;
            const callbackFindIndex = (user) => user.userId.toString() === userId.toString();
            if (likeStatus === "Like") {
            }
            const isUserLikedBefore = postInstance.likingUsers.find(callbackFindIndex);
            if (!isUserLikedBefore) {
                postInstance.likingUsers.push({ userId: userId, myStatus: "None" });
                yield postInstance.save();
            }
            const indexOfUser = postInstance.likingUsers.findIndex(callbackFindIndex);
            const myStatus = postInstance.likingUsers.find(callbackFindIndex).myStatus;
            switch (likeStatus) {
                case 'Like':
                    if (myStatus === "Like") {
                        postInstance.likingUsers[indexOfUser].myStatus = "Like";
                    }
                    if (myStatus === "None") {
                        ++postInstance.extendedLikesInfo.likesCount;
                        postInstance.likingUsers[indexOfUser].myStatus = "Like";
                        postInstance.likes.push({ addedAt: new Date().toISOString(), userId: userId.toString(), login: login });
                    }
                    if (myStatus === "Dislike") {
                        --postInstance.extendedLikesInfo.dislikesCount;
                        ++postInstance.extendedLikesInfo.likesCount;
                        postInstance.likingUsers[indexOfUser].myStatus = "Like";
                        postInstance.likes.push({ addedAt: new Date().toISOString(), userId: userId.toString(), login: login });
                    }
                    break;
                case 'Dislike':
                    if (myStatus === "Like") {
                        --postInstance.extendedLikesInfo.likesCount;
                        ++postInstance.extendedLikesInfo.dislikesCount;
                        postInstance.likingUsers[indexOfUser].myStatus = "Dislike";
                        postInstance.likes = postInstance.likes.filter(like => like.userId !== userId.toString());
                    }
                    if (myStatus === "None") {
                        ++postInstance.extendedLikesInfo.dislikesCount;
                        postInstance.likingUsers[indexOfUser].myStatus = "Dislike";
                    }
                    if (myStatus === "Dislike") {
                        postInstance.likingUsers[indexOfUser].myStatus = "Dislike";
                    }
                    break;
                case 'None':
                    if (myStatus === "Like") {
                        --postInstance.extendedLikesInfo.likesCount;
                        postInstance.likingUsers[indexOfUser].myStatus = "None";
                        postInstance.likes = postInstance.likes.filter(like => like.userId !== userId.toString());
                    }
                    if (myStatus === "Dislike") {
                        --postInstance.extendedLikesInfo.dislikesCount;
                        postInstance.likingUsers[indexOfUser].myStatus = "None";
                    }
                    if (myStatus === "None") {
                        postInstance.likingUsers[indexOfUser].myStatus = "None";
                    }
                    break;
            }
            yield postInstance.save();
            return true;
        });
    }
}
exports.PostsService = PostsService;
exports.postsService = new PostsService();
