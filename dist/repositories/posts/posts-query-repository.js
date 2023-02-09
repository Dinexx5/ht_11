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
exports.postsQueryRepository = void 0;
const db_1 = require("../db");
const mongodb_1 = require("mongodb");
function postsMapperToPostType(post) {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    };
}
exports.postsQueryRepository = {
    getPosts(query, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortDirection = "desc", sortBy = "createdAt", pageNumber = 1, pageSize = 10 } = query;
            const sortDirectionNumber = sortDirection === "desc" ? -1 : 1;
            const skippedPostsNumber = (+pageNumber - 1) * +pageSize;
            const filter = {};
            if (blogId) {
                filter.blogId = { $regex: blogId };
            }
            const countAll = yield db_1.PostModel.countDocuments(filter);
            let postsDb = yield db_1.PostModel
                .find(filter)
                .sort({ [sortBy]: sortDirectionNumber, title: sortDirectionNumber, id: sortDirectionNumber })
                .skip(skippedPostsNumber)
                .limit(+pageSize)
                .lean();
            const postsView = postsDb.map(postsMapperToPostType);
            return {
                pagesCount: Math.ceil(countAll / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: countAll,
                items: postsView
            };
        });
    },
    findPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            let _id = new mongodb_1.ObjectId(postId);
            let foundPost = yield db_1.PostModel.findOne({ _id: _id });
            if (!foundPost) {
                return null;
            }
            return postsMapperToPostType(foundPost);
        });
    },
};
