import {
    CommentDbModel, commentViewModel,
    paginationQuerys, paginatedViewModel, userAccountDbModel
} from "../../models/models";
import {CommentModelClass} from "../db";
import {ObjectId} from "mongodb";

function mapCommentToViewModel (comment: CommentDbModel, user?: userAccountDbModel | null): commentViewModel {
    if (!user) {
        return mapperToCommentViewModel(comment)
    }
    const userId = user._id
    const isUserLikedBefore = comment.likingUsers.find(user => user.userId.toString() === userId.toString())!
    if (!isUserLikedBefore) {
        return mapperToCommentViewModel(comment)
    }
    const myStatus = isUserLikedBefore.myStatus
    return  mapperToCommentViewModel(comment, myStatus)
}

function mapCommentsToViewModel (this:any, comment: CommentDbModel): commentViewModel {
    if (!this || !this.user) {
        return mapperToCommentViewModel(comment)
    }
    const userId = this.user._id
    const isUserLikedBefore = comment.likingUsers.find(user => user.userId.toString() === userId.toString())!
    if (!isUserLikedBefore) {
        return mapperToCommentViewModel(comment)
    }
    const myStatus = isUserLikedBefore.myStatus
    return  mapperToCommentViewModel(comment, myStatus)
}

function mapperToCommentViewModel (comment: CommentDbModel, myStatus?: string): commentViewModel {
    const filter = {myStatus: "None"}
    if (myStatus) {
        filter.myStatus = myStatus
    }
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
            myStatus: filter.myStatus
        }
    }
}

export class CommentsQueryRepository {
    async getAllCommentsForPost(query: paginationQuerys, postId: string, user?: userAccountDbModel | null): Promise<paginatedViewModel<commentViewModel[]>> {

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

        const commentsView = commentsDb.map(mapCommentsToViewModel, {user: user})
        return {
            pagesCount: Math.ceil(countAll / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: countAll,
            items: commentsView
        }
    }

    async findCommentById(commentId: string, user?: userAccountDbModel | null): Promise<commentViewModel | null> {

        let _id = new ObjectId(commentId)
        let foundComment: CommentDbModel | null = await CommentModelClass.findOne({_id: _id})
        if (!foundComment) {
            return null
        }
        return mapCommentToViewModel(foundComment, user)
    }
}
export const commentsQueryRepository = new CommentsQueryRepository()
