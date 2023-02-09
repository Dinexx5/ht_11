import {postsRepository} from "../repositories/posts/posts-repository-db";
import {
    createPostInputModelWithBlogId, postDbModel,
    postViewModel,
    updatePostInputModel
} from "../models/models";
import {blogsQueryRepository} from "../repositories/blogs/blogs-query-repository";
import {ObjectId} from "mongodb";


export const postsService = {


    async createPost(postBody: createPostInputModelWithBlogId): Promise<postViewModel> {
        const {title, shortDescription, content, blogId} = postBody
        let foundBlog = await blogsQueryRepository.findBlogById(blogId)
        const newDbPost: postDbModel  = {
            _id: new ObjectId(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: foundBlog!.name,
            createdAt: foundBlog!.createdAt
        }
        await postsRepository.createPost(newDbPost)
        return {
            id: newDbPost._id.toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: foundBlog!.name,
            createdAt: foundBlog!.createdAt
        }
    },

    async deletePostById(postId: string): Promise<boolean> {
        return await postsRepository.deletePostById(postId)
    },

    async UpdatePostById(postId: string, postBody: updatePostInputModel): Promise<boolean> {
        return await postsRepository.UpdatePostById(postId, postBody)
    }
}