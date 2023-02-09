import {BlogModelClass} from "../db";
import {ObjectId} from "mongodb";
import {
    blogDbModel,
    blogViewModel,
    paginationQuerys, paginatedViewModel
} from "../../models/models";

function mapFoundBlogToBlogViewModel (blog: blogDbModel): blogViewModel {
    return  {
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        id: blog._id.toString()
    }
}

export const blogsQueryRepository = {


    async getAllBlogs(query: paginationQuerys): Promise<paginatedViewModel<blogViewModel[]>> {

        const {sortDirection = "desc", sortBy = "createdAt", pageNumber = 1, pageSize = 10, searchNameTerm = null} = query
        const sortDirectionInt: 1 | -1 = sortDirection === "desc" ? -1 : 1;
        const skippedBlogsCount = (+pageNumber-1)*+pageSize

        const filter = {} as {name?: {$regex: string, $options: string}}
        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: 'i' }
        }

        const countAll = await BlogModelClass.countDocuments(filter)
        let blogsDb = await BlogModelClass
            .find( filter )
            .sort( {[sortBy]: sortDirectionInt} )
            .skip(skippedBlogsCount)
            .limit(+pageSize)
            .lean()

        const blogsView = blogsDb.map(mapFoundBlogToBlogViewModel)
        return {
            pagesCount: Math.ceil(countAll/+pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: countAll,
            items: blogsView
        }

    },

    async findBlogById(blogId: string): Promise<blogViewModel | null> {

        let _id = new ObjectId(blogId)
        let foundBlog: blogDbModel | null = await BlogModelClass.findOne({_id: _id}).lean()
        if (!foundBlog) {
            return null
        }
        return mapFoundBlogToBlogViewModel(foundBlog)
    },

}