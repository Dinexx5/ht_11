import mongoose, {Schema} from "mongoose";
import {
    accountData, attemptDbModel,
    BlogDbModel,
    CommentDbModel, DeviceDbModel,
    emailConfirmation,
    passwordRecovery,
    PostDbModel, refreshTokenDbModel,
    userAccountDbModel
} from "./models";

export const blogSchema = new mongoose.Schema<BlogDbModel>({
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: String
});

export const postSchema = new mongoose.Schema<PostDbModel>({
    _id: Schema.Types.ObjectId,
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: String,
    createdAt: String,
    likingUsers: [{userId: Schema.Types.ObjectId, myStatus: String}],
    likes: [{addedAt: String, userId: String, login: String}],
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number,
    }
});

export const emailConfirmationSchema = new mongoose.Schema<emailConfirmation>({
    confirmationCode: String,
    expirationDate: Date,
    isConfirmed: String
});

export const passwordRecoverySchema = new mongoose.Schema<passwordRecovery>({
    recoveryCode: { type: String, default: null },
    expirationDate: { type: Date, default: null }

});
export const accountDataSchema = new mongoose.Schema<accountData>({
    login: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: String,
    passwordHash: String
});

export const userAccountSchema = new mongoose.Schema<userAccountDbModel>({
    _id: Schema.Types.ObjectId,
    accountData: accountDataSchema,
    emailConfirmation: emailConfirmationSchema,
    passwordRecovery: passwordRecoverySchema
});

export const commentSchema = new mongoose.Schema<CommentDbModel>({
    _id: Schema.Types.ObjectId,
    content: { type: String, required: true },
    createdAt: String,
    commentatorInfo: {
        userId: String,
        userLogin: String
    },
    likingUsers: [{userId: Schema.Types.ObjectId, myStatus: String}],
    postId: String,
    likesInfo: {
        likesCount: Number,
        dislikesCount: Number,
    }
});

export const tokenSchema = new mongoose.Schema<refreshTokenDbModel>({
    _id: Schema.Types.ObjectId,
    issuedAt: String,
    deviceId: String,
    deviceName: String,
    ip: String,
    userId: Object,
    expiredAt: String
});
export const deviceSchema = new mongoose.Schema<DeviceDbModel>({
    _id: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    ip: String,
    title: String,
    lastActiveDate: String,
    deviceId: String
});

export const attemptSchema = new mongoose.Schema<attemptDbModel>({
    _id: Schema.Types.ObjectId,
    requestData: String,
    date: String
});