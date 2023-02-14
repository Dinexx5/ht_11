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
    constructor(_id, title, shortDescription, content, blogId, blogName, createdAt, likingUsers, likes, extendedLikesInfo) {
        this._id = _id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
        this.likingUsers = likingUsers;
        this.likes = likes;
        this.extendedLikesInfo = extendedLikesInfo;
    }
}
exports.PostDbModel = PostDbModel;
class CommentDbModel {
    constructor(_id, content, createdAt, commentatorInfo, likingUsers, postId, likesInfo) {
        this._id = _id;
        this.content = content;
        this.createdAt = createdAt;
        this.commentatorInfo = commentatorInfo;
        this.likingUsers = likingUsers;
        this.postId = postId;
        this.likesInfo = likesInfo;
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
