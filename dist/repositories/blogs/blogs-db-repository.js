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
exports.BlogsRepository = void 0;
const db_1 = require("../db");
class BlogsRepository {
    createBlog(newDbBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogInstance = new db_1.BlogModelClass(newDbBlog);
            yield blogInstance.save();
            return newDbBlog;
        });
    }
    deleteBlogById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogInstance = yield db_1.BlogModelClass.findOne({ _id: _id });
            if (!blogInstance) {
                return false;
            }
            yield blogInstance.deleteOne();
            return true;
        });
    }
    UpdateBlogById(_id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = body;
            const blogInstance = yield db_1.BlogModelClass.findOne({ _id: _id });
            if (!blogInstance) {
                return false;
            }
            blogInstance.name = name;
            blogInstance.description = description;
            blogInstance.websiteUrl = websiteUrl;
            yield blogInstance.save();
            return true;
        });
    }
}
exports.BlogsRepository = BlogsRepository;
