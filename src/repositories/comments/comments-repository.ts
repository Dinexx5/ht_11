import {CommentModelClass} from "../db";
import {
    CommentDbModel,
} from "../../models/models";
import {ObjectId} from "mongodb";

class CommentsRepository {
    async createComment (comment: CommentDbModel): Promise<CommentDbModel> {
        await CommentModelClass.create(comment)
        return comment
    }

    async updateComment (id: string, content: string): Promise<boolean> {
        let _id = new ObjectId(id)
        let result = await CommentModelClass.updateOne({_id: _id}, {$set: {content: content}})
        return result.matchedCount === 1
    }

    async deleteComment (id: string): Promise<boolean> {
        let _id = new ObjectId(id)
        let result = await CommentModelClass.deleteOne({_id: _id})
        return result.deletedCount === 1
    }

}

export const commentsRepository = new CommentsRepository()