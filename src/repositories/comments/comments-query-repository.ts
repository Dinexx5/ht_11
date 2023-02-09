import {
    commentDbModel, commentViewModel,
    paginationQuerys, paginatedViewModel
} from "../../models/models";
import {CommentModel} from "../db";
import {ObjectId} from "mongodb";

function mapCommentToCommentViewModel (comment: commentDbModel): commentViewModel {
    return  {
        id: comment._id.toString(),
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userLogin,
        createdAt: comment.createdAt,
    }

}

export const commentsQueryRepository = {

    async getAllCommentsForPost(query: paginationQuerys, postId: string): Promise<paginatedViewModel<commentViewModel[]>> {

        const {sortDirection = "desc", sortBy = "createdAt", pageNumber = 1, pageSize = 10} = query
        const sortDirectionNumber: 1 | -1 = sortDirection === "desc" ? -1 : 1;
        const skippedCommentsNumber = (+pageNumber - 1) * +pageSize

        const countAll = await CommentModel.countDocuments({postId: postId})
        let commentsDb = await CommentModel
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


    },
    async findCommentById(commentId: string): Promise<commentViewModel | null> {

        let _id = new ObjectId(commentId)
        let foundComment: commentDbModel | null = await CommentModel.findOne({_id: _id})
        if (!foundComment) {
            return null
        }
        return mapCommentToCommentViewModel(foundComment)
    }
}

