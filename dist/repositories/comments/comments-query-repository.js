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
exports.commentsQueryRepository = exports.CommentsQueryRepository = void 0;
const db_1 = require("../db");
const mongodb_1 = require("mongodb");
function mapCommentToViewModel(comment, user) {
    if (!user) {
        return mapperToCommentViewModel(comment);
    }
    const userId = user._id;
    const isUserLikedBefore = comment.likingUsers.find(user => user.userId.toString() === userId.toString());
    if (!isUserLikedBefore) {
        return mapperToCommentViewModel(comment);
    }
    const myStatus = isUserLikedBefore.myStatus;
    return mapperToCommentViewModel(comment, myStatus);
}
function mapCommentsToViewModel(comment) {
    if (!this || !this.user) {
        return mapperToCommentViewModel(comment);
    }
    const userId = this.user._id;
    const isUserLikedBefore = comment.likingUsers.find(user => user.userId.toString() === userId.toString());
    if (!isUserLikedBefore) {
        return mapperToCommentViewModel(comment);
    }
    const myStatus = isUserLikedBefore.myStatus;
    return mapperToCommentViewModel(comment, myStatus);
}
function mapperToCommentViewModel(comment, myStatus) {
    const filter = { myStatus: "None" };
    if (myStatus) {
        filter.myStatus = myStatus;
    }
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus: filter.myStatus
        }
    };
}
class CommentsQueryRepository {
    getAllCommentsForPost(query, postId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortDirection = "desc", sortBy = "createdAt", pageNumber = 1, pageSize = 10 } = query;
            const sortDirectionNumber = sortDirection === "desc" ? -1 : 1;
            const skippedCommentsNumber = (+pageNumber - 1) * +pageSize;
            const countAll = yield db_1.CommentModelClass.countDocuments({ postId: postId });
            let commentsDb = yield db_1.CommentModelClass
                .find({ postId: postId })
                .sort({ [sortBy]: sortDirectionNumber })
                .skip(skippedCommentsNumber)
                .limit(+pageSize)
                .lean();
            const commentsView = commentsDb.map(mapCommentsToViewModel, { user: user });
            return {
                pagesCount: Math.ceil(countAll / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: countAll,
                items: commentsView
            };
        });
    }
    findCommentById(commentId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let _id = new mongodb_1.ObjectId(commentId);
            let foundComment = yield db_1.CommentModelClass.findOne({ _id: _id });
            if (!foundComment) {
                return null;
            }
            return mapCommentToViewModel(foundComment, user);
        });
    }
}
exports.CommentsQueryRepository = CommentsQueryRepository;
exports.commentsQueryRepository = new CommentsQueryRepository();
