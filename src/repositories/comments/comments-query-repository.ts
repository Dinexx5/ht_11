import {
    CommentDbModel, commentViewModel,
    paginationQuerys, paginatedViewModel, userAccountDbModel
} from "../../models/models";
import {CommentModelClass} from "../db";
import {ObjectId} from "mongodb";

function mapCommentToCommentViewModel (comment: CommentDbModel, user?: userAccountDbModel): commentViewModel {
    if (!user) {
        return mapCommentToCommentViewModelNoAuth(comment)
    }
    const userId = user._id
    const isUser = comment.likingUsers.find(user => user.userId.toString() === userId.toString())!
    if (!isUser) {
        return mapCommentToCommentViewModelNoAuth(comment)
    }
    const myStatus = isUser.myStatus
    return  mapCommentToCommentViewModelWithAuth(comment, myStatus)
}

function mapCommentsToCommentViewModel (this:any, comment: CommentDbModel): commentViewModel {
    if (!this) {
        return mapCommentToCommentViewModelNoAuth(comment)
    }
    const userId: userAccountDbModel = this.user._id
    const isUser = comment.likingUsers.find(user => user.userId.toString() === userId.toString())!
    if (!isUser) {
        return mapCommentToCommentViewModelNoAuth(comment)
    }
    const myStatus = isUser.myStatus
    return  mapCommentToCommentViewModelWithAuth(comment, myStatus)
}

function mapCommentToCommentViewModelWithAuth (comment: CommentDbModel, myStatus: string): commentViewModel {
    return  {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount:  comment.likesInfo.dislikesCount,
            myStatus: myStatus
        }
    }
}
function mapCommentToCommentViewModelNoAuth (comment: CommentDbModel): commentViewModel {
    return  {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount:  comment.likesInfo.dislikesCount,
            myStatus: "None"
        }
    }
}



export class CommentsQueryRepository {
    async getAllCommentsForPost(query: paginationQuerys, postId: string, user?: userAccountDbModel): Promise<paginatedViewModel<commentViewModel[]>> {

        const {sortDirection = "desc", sortBy = "createdAt", pageNumber = 1, pageSize = 10} = query
        const sortDirectionNumber: 1 | -1 = sortDirection === "desc" ? -1 : 1;
        const skippedCommentsNumber = (+pageNumber - 1) * +pageSize

        const countAll = await CommentModelClass.countDocuments({postId: postId})
        let commentsDb = await CommentModelClass
            .find({postId: postId})
            .sort({[sortBy]: sortDirectionNumber})
            .skip(skippedCommentsNumber)
            .limit(+pageSize)
            .lean()

        if(!user) {
            const commentsView = commentsDb.map(mapCommentsToCommentViewModel)
            return {
                pagesCount: Math.ceil(countAll / +pageSize),
                page: +pageNumber,
                pageSize: +pageSize,
                totalCount: countAll,
                items: commentsView
            }
        }
        const commentsView = commentsDb.map(mapCommentsToCommentViewModel, {user: user})
        return {
            pagesCount: Math.ceil(countAll / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: countAll,
            items: commentsView
        }
    }
    // async getAllCommentsForPostNoAuth(query: paginationQuerys, postId: string): Promise<paginatedViewModel<commentViewModel[]>> {
    //
    //     const {sortDirection = "desc", sortBy = "createdAt", pageNumber = 1, pageSize = 10} = query
    //     const sortDirectionNumber: 1 | -1 = sortDirection === "desc" ? -1 : 1;
    //     const skippedCommentsNumber = (+pageNumber - 1) * +pageSize
    //
    //     const countAll = await CommentModelClass.countDocuments({postId: postId})
    //     let commentsDb = await CommentModelClass
    //         .find({postId: postId})
    //         .sort({[sortBy]: sortDirectionNumber})
    //         .skip(skippedCommentsNumber)
    //         .limit(+pageSize)
    //         .lean()
    //
    //     const commentsView = commentsDb.map(mapCommentToCommentViewModelNoAuth)
    //     return {
    //         pagesCount: Math.ceil(countAll / +pageSize),
    //         page: +pageNumber,
    //         pageSize: +pageSize,
    //         totalCount: countAll,
    //         items: commentsView
    //     }
    // }
    async findCommentById(commentId: string, user?: userAccountDbModel): Promise<commentViewModel | null> {

        let _id = new ObjectId(commentId)
        let foundComment: CommentDbModel | null = await CommentModelClass.findOne({_id: _id})
        if (!foundComment) {
            return null
        }

        return mapCommentToCommentViewModel(foundComment, user)
    }

    // async findCommentNoAuth(commentId: string): Promise<commentViewModel | null> {
    //
    //     let _id = new ObjectId(commentId)
    //     let foundComment: CommentDbModel | null = await CommentModelClass.findOne({_id: _id})
    //     if (!foundComment) {
    //         return null
    //     }
    //     return mapCommentToCommentViewModelNoAuth(foundComment)
    // }
}
export const commentsQueryRepository = new CommentsQueryRepository()
