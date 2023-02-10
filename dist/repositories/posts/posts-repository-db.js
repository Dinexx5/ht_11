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
exports.PostsRepository = void 0;
const db_1 = require("../db");
const mongodb_1 = require("mongodb");
class PostsRepository {
    createPost(newDbPost) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.PostModelClass.create(newDbPost);
            return newDbPost;
        });
    }
    deletePostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            let _id = new mongodb_1.ObjectId(postId);
            let result = yield db_1.PostModelClass.deleteOne({ _id: _id });
            return result.deletedCount === 1;
        });
    }
    UpdatePostById(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, shortDescription, content, blogId } = body;
            let _id = new mongodb_1.ObjectId(id);
            let result = yield db_1.PostModelClass.updateOne({ _id: _id }, { $set: { title: title, shortDescription: shortDescription, content: content, blogId: blogId } });
            return result.matchedCount === 1;
        });
    }
}
exports.PostsRepository = PostsRepository;
