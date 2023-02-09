import {PostModel} from "../db";
import {ObjectId} from "mongodb";
import {
    paginationQuerys,
    postDbModel,
    postViewModel, paginatedViewModel,
} from "../../models/models";

function postsMapperToPostType (post: postDbModel): postViewModel {
    return  {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

export const postsQueryRepository = {

    async getPosts (query: paginationQuerys, blogId?: string): Promise< paginatedViewModel<postViewModel[]> > {
        const {sortDirection = "desc", sortBy = "createdAt",pageNumber = 1,pageSize = 10} = query

        const sortDirectionNumber: 1 | -1 = sortDirection === "desc" ? -1 : 1;
        const skippedPostsNumber = (+pageNumber-1)*+pageSize

        const filter = {} as {blogId?: {$regex: string}}
        if (blogId) {
            filter.blogId = {$regex: blogId}
        }

        const countAll = await PostModel.countDocuments(filter)

        let postsDb = await PostModel
            .find( filter )
            .sort( {[sortBy]: sortDirectionNumber, title: sortDirectionNumber, id: sortDirectionNumber} )
            .skip( skippedPostsNumber )
            .limit( +pageSize )
            .lean()

        const postsView = postsDb.map(postsMapperToPostType)
        return {
            pagesCount: Math.ceil(countAll/+pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: countAll,
            items: postsView
        }
    },

    async findPostById (postId: string): Promise<postViewModel | null> {
        let _id = new ObjectId(postId)
        let foundPost: postDbModel | null = await PostModel.findOne({_id: _id})
        if (!foundPost) {
            return null
        }
        return postsMapperToPostType(foundPost)
    },

}