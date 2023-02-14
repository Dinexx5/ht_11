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
exports.postsQueryRepository = exports.PostsQueryRepository = void 0;
const db_1 = require("../db");
const mongodb_1 = require("mongodb");
function mapPostToViewModel(post, user) {
    if (!user) {
        return mapperToPostViewModel(post);
    }
    const userId = user._id;
    const isUserLikedBefore = post.likingUsers.find(user => user.userId.toString() === userId.toString());
    if (!isUserLikedBefore) {
        return mapperToPostViewModel(post);
    }
    const myStatus = isUserLikedBefore.myStatus;
    return mapperToPostViewModel(post, myStatus);
}
function mapPostsToViewModel(post) {
    if (!this || !this.user) {
        return mapperToPostViewModel(post);
    }
    const userId = this.user._id;
    const isUserLikedBefore = post.likingUsers.find(user => user.userId.toString() === userId.toString());
    if (!isUserLikedBefore) {
        return mapperToPostViewModel(post);
    }
    const myStatus = isUserLikedBefore.myStatus;
    return mapperToPostViewModel(post, myStatus);
}
function mapperToPostViewModel(post, myStatus) {
    const filter = { myStatus: "None" };
    if (myStatus) {
        filter.myStatus = myStatus;
    }
    console.log(post);
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: post.extendedLikesInfo.likesCount,
            dislikesCount: post.extendedLikesInfo.dislikesCount,
            myStatus: filter.myStatus,
            newestLikes: post.likes.slice(-3).map(like => ({
                addedAt: like.addedAt,
                userId: like.userId,
                login: like.login
            })).reverse()
        }
    };
}
class PostsQueryRepository {
    getAllPosts(query, blogId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortDirection = "desc", sortBy = "createdAt", pageNumber = 1, pageSize = 10 } = query;
            const sortDirectionNumber = sortDirection === "desc" ? -1 : 1;
            const skippedPostsNumber = (+pageNumber - 1) * +pageSize;
            const filter = {};
            if (blogId) {
                filter.blogId = { $regex: blogId };
            }
            const countAll = yield db_1.PostModelClass.countDocuments(filter);
            let postsDb = yield db_1.PostModelClass
                .find(filter)
                .sort({ [sortBy]: sortDirectionNumber, title: sortDirectionNumber, id: sortDirectionNumber })
                .skip(skippedPostsNumber)
                .limit(+pageSize)
                .lean();
            const postsView = postsDb.map(mapPostsToViewModel, { user: user }).reverse();
            return {
                pagesCount: Math.ceil(countAll / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: countAll,
                items: postsView
            };
        });
    }
    findPostById(postId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let _id = new mongodb_1.ObjectId(postId);
            let foundPost = yield db_1.PostModelClass.findOne({ _id: _id });
            if (!foundPost) {
                return null;
            }
            return mapPostToViewModel(foundPost, user);
        });
    }
}
exports.PostsQueryRepository = PostsQueryRepository;
exports.postsQueryRepository = new PostsQueryRepository();
