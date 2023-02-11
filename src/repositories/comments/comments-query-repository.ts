import {
    CommentDbModel, commentViewModel,
    paginationQuerys, paginatedViewModel
} from "../../models/models";
import {CommentModelClass} from "../db";
import {ObjectId} from "mongodb";

function mapCommentToCommentViewModel (comment: CommentDbModel): commentViewModel {
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
            myStatus: 'None'
        }
    }

}
export class CommentsQueryRepository {
    async getAllCommentsForPost(query: paginationQuerys, postId: string): Promise<paginatedViewModel<commentViewModel[]>> {

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

        const commentsView = commentsDb.map(mapCommentToCommentViewModel)
        return {
            pagesCount: Math.ceil(countAll / +pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: countAll,
            items: commentsView
        }
    }
    async findCommentById(commentId: string): Promise<commentViewModel | null> {

        let _id = new ObjectId(commentId)
        let foundComment: CommentDbModel | null = await CommentModelClass.findOne({_id: _id})
        if (!foundComment) {
            return null
        }
        return mapCommentToCommentViewModel(foundComment)
    }
}
export const commentsQueryRepository = new CommentsQueryRepository()
