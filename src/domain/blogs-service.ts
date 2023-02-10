import {BlogsRepository} from "../repositories/blogs/blogs-db-repository";
import {BlogDbModel, blogViewModel, createBlogInputModel, updateBlogInputModel} from "../models/models";
import {ObjectId} from "mongodb";


export class BlogsService {
    blogsRepository: BlogsRepository
    constructor() {
        this.blogsRepository = new BlogsRepository()
    }
    async createBlog (blogBody: createBlogInputModel): Promise<blogViewModel> {
        const {name, description, websiteUrl} = blogBody
        const newDbBlog = new BlogDbModel(
            new ObjectId(),
            name,
            description,
            websiteUrl,
            new Date().toISOString()
        )
        const blog = await this.blogsRepository.createBlog(newDbBlog)
        return {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            id: blog._id.toString()
        }
    }

    async deleteBlogById(blogId: string): Promise<boolean> {
        let _id = new ObjectId(blogId)
        return await this.blogsRepository.deleteBlogById(_id)
    }

    async UpdateBlogById(blogId: string, blogBody: updateBlogInputModel): Promise<boolean> {
        let _id = new ObjectId(blogId)
        return await this.blogsRepository.UpdateBlogById(_id, blogBody)
    }
}
