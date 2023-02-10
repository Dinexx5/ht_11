import {PostsRepository} from "../repositories/posts/posts-repository-db";
import {
    createPostInputModelWithBlogId, PostDbModel,
    postViewModel,
    updatePostInputModel
} from "../models/models";
import {ObjectId} from "mongodb";
import {blogsQueryRepository} from "../repositories/blogs/blogs-query-repository";

export class PostsService {
    private postsRepository: PostsRepository;
    constructor() {
        this.postsRepository = new PostsRepository()
    }
    async createPost(postBody: createPostInputModelWithBlogId): Promise<postViewModel> {
        const {title, shortDescription, content, blogId} = postBody
        let foundBlog = await blogsQueryRepository.findBlogById(blogId)
        const newDbPost = new PostDbModel(
            new ObjectId(),
            title,
            shortDescription,
            content,
            blogId,
            foundBlog!.name,
            foundBlog!.createdAt
        )
        await this.postsRepository.createPost(newDbPost)
        return {
            id: newDbPost._id.toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: foundBlog!.name,
            createdAt: foundBlog!.createdAt
        }
    }

    async deletePostById(postId: string): Promise<boolean> {
        return await this.postsRepository.deletePostById(postId)
    }

    async UpdatePostById(postId: string, postBody: updatePostInputModel): Promise<boolean> {
        return await this.postsRepository.UpdatePostById(postId, postBody)
    }
}
export const postsService = new PostsService()


