import {blogsRepository} from "../repositories/blogs/blogs-db-repository";
import {blogDbModel, blogViewModel, createBlogInputModel, updateBlogInputModel} from "../models/models";
import {ObjectId} from "mongodb";


export const blogsService = {


    async createBlog(blogBody: createBlogInputModel): Promise<blogViewModel> {
        const {name, description, websiteUrl} = blogBody
        const newDbBlog: blogDbModel = {
            _id: new ObjectId(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString()
        }
        const blog = await blogsRepository.createBlog(newDbBlog)
        return {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            id: blog._id.toString()
        }
    },


    async deleteBlogById(blogId: string): Promise<boolean> {
        let _id = new ObjectId(blogId)
        return await blogsRepository.deleteBlogById(_id)
    },

    async UpdateBlogById(blogId: string, blogBody: updateBlogInputModel): Promise<boolean> {
        let _id = new ObjectId(blogId)
        return await blogsRepository.UpdateBlogById(_id, blogBody)
    }
}