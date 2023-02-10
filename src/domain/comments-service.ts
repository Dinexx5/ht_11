import {CommentDbModel, userAccountDbModel} from "../models/models";
import {commentsRepository} from "../repositories/comments/comments-repository";
import {ObjectId} from "mongodb";


class CommentsService {

    async createComment (content: string, user: userAccountDbModel, postId: string){
        const commentDb: CommentDbModel = {
            _id: new ObjectId(),
            content: content,
            createdAt: new Date().toISOString(),
            userId: user._id.toString(),
            userLogin: user.accountData.login,
            postId: postId
        }
        await commentsRepository.createComment(commentDb)
        return {
            id: commentDb._id.toString(),
            content: commentDb.content,
            userId: commentDb.userId,
            userLogin: commentDb.userLogin,
            createdAt: commentDb.createdAt
        }
    }

    async updateCommentById (id: string, content: string) {
        return await commentsRepository.updateComment(id, content)
    }

    async deleteCommentById (id: string) {
        return await commentsRepository.deleteComment(id)
    }
}

export const commentsService = new CommentsService()