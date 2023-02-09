import {PostModel} from "../db";
import {ObjectId} from "mongodb";
import {postDbModel, updatePostInputModel} from "../../models/models";


export const postsRepository = {

    async createPost (newDbPost: postDbModel): Promise<postDbModel> {
        await PostModel.create(newDbPost)
        return newDbPost
    },

    async deletePostById (postId: string): Promise<boolean> {
        let _id = new ObjectId(postId)
        let result = await PostModel.deleteOne({_id: _id})
        return result.deletedCount === 1
    },

    async UpdatePostById (id: string, body: updatePostInputModel): Promise<boolean> {
        const {title, shortDescription, content, blogId} = body
        let _id = new ObjectId(id)
        let result = await PostModel.updateOne({_id: _id}, {$set: {title: title, shortDescription: shortDescription, content: content, blogId: blogId}})
        return result.matchedCount === 1
    }
}