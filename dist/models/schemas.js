"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attemptSchema = exports.deviceSchema = exports.tokenSchema = exports.commentSchema = exports.userAccountSchema = exports.accountDataSchema = exports.passwordRecoverySchema = exports.emailConfirmationSchema = exports.postSchema = exports.blogSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.blogSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: String
});
exports.postSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: String,
    createdAt: String,
    likingUsers: [{ userId: mongoose_1.Schema.Types.ObjectId, myStatus: String }],
    likes: [{ addedAt: String, userId: String, login: String }],
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number,
    }
});
exports.emailConfirmationSchema = new mongoose_1.default.Schema({
    confirmationCode: String,
    expirationDate: Date,
    isConfirmed: String
});
exports.passwordRecoverySchema = new mongoose_1.default.Schema({
    recoveryCode: { type: String, default: null },
    expirationDate: { type: Date, default: null }
});
exports.accountDataSchema = new mongoose_1.default.Schema({
    login: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: String,
    passwordHash: String
});
exports.userAccountSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    accountData: exports.accountDataSchema,
    emailConfirmation: exports.emailConfirmationSchema,
    passwordRecovery: exports.passwordRecoverySchema
});
exports.commentSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    content: { type: String, required: true },
    createdAt: String,
    commentatorInfo: {
        userId: String,
        userLogin: String
    },
    likingUsers: [{ userId: mongoose_1.Schema.Types.ObjectId, myStatus: String }],
    postId: String,
    likesInfo: {
        likesCount: Number,
        dislikesCount: Number,
    }
});
exports.tokenSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    issuedAt: String,
    deviceId: String,
    deviceName: String,
    ip: String,
    userId: Object,
    expiredAt: String
});
exports.deviceSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    userId: mongoose_1.Schema.Types.ObjectId,
    ip: String,
    title: String,
    lastActiveDate: String,
    deviceId: String
});
exports.attemptSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    requestData: String,
    date: String
});
