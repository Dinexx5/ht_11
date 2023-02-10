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
class PostsService {
    constructor() {
        this.postsRepository = new posts_repository_db_1.PostsRepository();
    }
    createPost(postBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, shortDescription, content, blogId } = postBody;
            let foundBlog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(blogId);
            const newDbPost = new models_1.PostDbModel(new mongodb_1.ObjectId(), title, shortDescription, content, blogId, foundBlog.name, foundBlog.createdAt);
            yield this.postsRepository.createPost(newDbPost);
            return {
                id: newDbPost._id.toString(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: foundBlog.name,
                createdAt: foundBlog.createdAt
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
}
exports.PostsService = PostsService;
exports.postsService = new PostsService();
