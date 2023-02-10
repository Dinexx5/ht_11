import {PostModelClass} from "../db";
import {ObjectId} from "mongodb";
import {PostDbModel, updatePostInputModel} from "../../models/models";

export class PostsRepository {

    async createPost (newDbPost: PostDbModel): Promise<PostDbModel> {
        await PostModelClass.create(newDbPost)
        return newDbPost
    }

    async deletePostById (postId: string): Promise<boolean> {
        let _id = new ObjectId(postId)
        let result = await PostModelClass.deleteOne({_id: _id})
        return result.deletedCount === 1
    }

    async UpdatePostById (id: string, body: updatePostInputModel): Promise<boolean> {
        const {title, shortDescription, content, blogId} = body
        let _id = new ObjectId(id)
        let result = await PostModelClass.updateOne({_id: _id}, {$set: {title: title, shortDescription: shortDescription, content: content, blogId: blogId}})
        return result.matchedCount === 1
    }
}
