"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceDbModel = exports.CommentDbModel = exports.PostDbModel = exports.BlogDbModel = void 0;
class BlogDbModel {
    constructor(_id, name, description, websiteUrl, createdAt) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.createdAt = createdAt;
    }
}
exports.BlogDbModel = BlogDbModel;
class PostDbModel {
    constructor(_id, title, shortDescription, content, blogId, blogName, createdAt) {
        this._id = _id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
    }
}
exports.PostDbModel = PostDbModel;
class CommentDbModel {
    constructor(_id, content, createdAt, userId, userLogin, postId) {
        this._id = _id;
        this.content = content;
        this.createdAt = createdAt;
        this.userId = userId;
        this.userLogin = userLogin;
        this.postId = postId;
    }
}
exports.CommentDbModel = CommentDbModel;
class DeviceDbModel {
    constructor(_id, userId, ip, title, lastActiveDate, deviceId) {
        this._id = _id;
        this.userId = userId;
        this.ip = ip;
        this.title = title;
        this.lastActiveDate = lastActiveDate;
        this.deviceId = deviceId;
    }
}
exports.DeviceDbModel = DeviceDbModel;
