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
exports.blogsService = void 0;
const blogs_db_repository_1 = require("../repositories/blogs/blogs-db-repository");
const mongodb_1 = require("mongodb");
exports.blogsService = {
    createBlog(blogBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = blogBody;
            const newDbBlog = {
                _id: new mongodb_1.ObjectId(),
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: new Date().toISOString()
            };
            const blog = yield blogs_db_repository_1.blogsRepository.createBlog(newDbBlog);
            return {
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                id: blog._id.toString()
            };
        });
    },
    deleteBlogById(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let _id = new mongodb_1.ObjectId(blogId);
            return yield blogs_db_repository_1.blogsRepository.deleteBlogById(_id);
        });
    },
    UpdateBlogById(blogId, blogBody) {
        return __awaiter(this, void 0, void 0, function* () {
            let _id = new mongodb_1.ObjectId(blogId);
            return yield blogs_db_repository_1.blogsRepository.UpdateBlogById(_id, blogBody);
        });
    }
};
