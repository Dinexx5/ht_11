import {CommentModel} from "../db";
import {
    commentDbModel,
    commentViewModel, userAccountDbModel,
} from "../../models/models";
import {ObjectId} from "mongodb";


export const commentsRepository = {

    async createComment (content: string, user: userAccountDbModel, postId: string): Promise<commentViewModel> {

        const commentDb: commentDbModel = {
            _id: new ObjectId(),
            content: content,
            createdAt: new Date().toISOString(),
            userId: user._id.toString(),
            userLogin: user.accountData.login,
            postId: postId
        }
        await CommentModel.create(commentDb)
        return {
            id: commentDb._id.toString(),
            content: commentDb.content,
            userId: commentDb.userId,
            userLogin: commentDb.userLogin,
            createdAt: commentDb.createdAt
        }
    },

    async updateComment (id: string, content: string): Promise<boolean> {
        let _id = new ObjectId(id)
        let result = await CommentModel.updateOne({_id: _id}, {$set: {content: content}})
        return result.matchedCount === 1
    },

    async deleteComment (id: string): Promise<boolean> {
        let _id = new ObjectId(id)
        let result = await CommentModel.deleteOne({_id: _id})
        return result.deletedCount === 1
    }

}