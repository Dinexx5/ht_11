import {BlogModelClass} from "../db";
import {ObjectId} from "mongodb";
import {BlogDbModel, updateBlogInputModel} from "../../models/models";

export class BlogsRepository {

    async createBlog(newDbBlog: BlogDbModel): Promise<BlogDbModel> {
        const blogInstance = new BlogModelClass(newDbBlog)
        await blogInstance.save()
        return newDbBlog
    }

    async deleteBlogById(_id: ObjectId): Promise<boolean> {
        const blogInstance = await BlogModelClass.findOne({_id: _id})
        if (!blogInstance){
            return false
        }
        await blogInstance.deleteOne()
        return true
    }

    async UpdateBlogById(_id: ObjectId, body: updateBlogInputModel): Promise<boolean> {
        const {name, description, websiteUrl} = body
        const blogInstance = await BlogModelClass.findOne({_id: _id})
        if (!blogInstance){
            return false
        }
        blogInstance.name = name
        blogInstance.description = description
        blogInstance.websiteUrl = websiteUrl
        await blogInstance.save()
        return true
    }
}


