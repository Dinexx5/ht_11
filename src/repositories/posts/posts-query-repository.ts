import {PostModelClass} from "../db";
import {ObjectId} from "mongodb";
import {
    paginationQuerys,
    PostDbModel,
    postViewModel, paginatedViewModel, userAccountDbModel, CommentDbModel, commentViewModel,
} from "../../models/models";

function mapPostToViewModel (post: PostDbModel, user?: userAccountDbModel | null): postViewModel {
    if (!user) {
        return mapperToPostViewModel(post)
    }
    const userId = user._id
    const isUserLikedBefore = post.likingUsers.find(user => user.userId.toString() === userId.toString())!
    if (!isUserLikedBefore) {
        return mapperToPostViewModel(post)
    }
    const myStatus = isUserLikedBefore.myStatus
    return  mapperToPostViewModel(post, myStatus)
}

function mapPostsToViewModel (this:any, post: PostDbModel): postViewModel {
    if (!this || !this.user) {
        return mapperToPostViewModel(post)
    }
    const userId = this.user._id
    const isUserLikedBefore = post.likingUsers.find(user => user.userId.toString() === userId.toString())!
    if (!isUserLikedBefore) {
        return mapperToPostViewModel(post)
    }
    const myStatus = isUserLikedBefore.myStatus
    return  mapperToPostViewModel(post, myStatus)
}

function mapperToPostViewModel (post: PostDbModel, myStatus?: string): postViewModel {
    const filter = {myStatus: "None"}
    if (myStatus) {
        filter.myStatus = myStatus
    }
    console.log(post)
    return  {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: post.extendedLikesInfo.likesCount,
            dislikesCount: post.extendedLikesInfo.dislikesCount,
            myStatus: filter.myStatus,
            newestLikes: post.likes.slice(-3).map(like => ({
                addedAt: like.addedAt,
                userId: like.userId,
                login: like.login
            })).reverse()
        }
    }
}

export class PostsQueryRepository {

    async getAllPosts (query: paginationQuerys, blogId?: string, user?: userAccountDbModel | null): Promise< paginatedViewModel<postViewModel[]> > {
        const {sortDirection = "desc", sortBy = "createdAt",pageNumber = 1,pageSize = 10} = query

        const sortDirectionNumber: 1 | -1 = sortDirection === "desc" ? -1 : 1;
        const skippedPostsNumber = (+pageNumber-1)*+pageSize

        const filter = {} as {blogId?: {$regex: string}}
        if (blogId) {
            filter.blogId = {$regex: blogId}
        }

        const countAll = await PostModelClass.countDocuments(filter)

        let postsDb = await PostModelClass
            .find( filter )
            .sort( {[sortBy]: sortDirectionNumber, title: sortDirectionNumber, id: sortDirectionNumber} )
            .skip( skippedPostsNumber )
            .limit( +pageSize )
            .lean()

        const postsView = postsDb.map(mapPostsToViewModel, {user: user})
        return {
            pagesCount: Math.ceil(countAll/+pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: countAll,
            items: postsView
        }
    }

    async findPostById (postId: string, user?: userAccountDbModel | null): Promise<postViewModel | null> {
        let _id = new ObjectId(postId)
        let foundPost: PostDbModel | null = await PostModelClass.findOne({_id: _id})
        if (!foundPost) {
            return null
        }
        return mapPostToViewModel(foundPost, user)
    }
}

export const postsQueryRepository = new PostsQueryRepository()