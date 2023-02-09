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
exports.blogsQueryRepository = void 0;
const db_1 = require("../db");
const mongodb_1 = require("mongodb");
function mapFoundBlogToBlogViewModel(blog) {
    return {
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        id: blog._id.toString()
    };
}
exports.blogsQueryRepository = {
    getAllBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortDirection = "desc", sortBy = "createdAt", pageNumber = 1, pageSize = 10, searchNameTerm = null } = query;
            const sortDirectionInt = sortDirection === "desc" ? -1 : 1;
            const skippedBlogsCount = (+pageNumber - 1) * +pageSize;
            const filter = {};
            if (searchNameTerm) {
                filter.name = { $regex: searchNameTerm, $options: 'i' };
            }
            const countAll = yield db_1.BlogModelClass.countDocuments(filter);
            let blogsDb = yield db_1.BlogModelClass
                .find(filter)
                .sort({ [sortBy]: sortDirectionInt })
                .skip(skippedBlogsCount)
                .limit(+pageSize)
                .lean();
            const blogsView = blogsDb.map(mapFoundBlogToBlogViewModel);
            return {
                pagesCount: Math.ceil(countAll / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: countAll,
                items: blogsView
            };
        });
    },
    findBlogById(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let _id = new mongodb_1.ObjectId(blogId);
            let foundBlog = yield db_1.BlogModelClass.findOne({ _id: _id }).lean();
            if (!foundBlog) {
                return null;
            }
            return mapFoundBlogToBlogViewModel(foundBlog);
        });
    },
};
