import {CommentDbModel, commentViewModel, likingUserModel, userAccountDbModel} from "../models/models";
import {commentsRepository} from "../repositories/comments/comments-repository";
import {ObjectId} from "mongodb";
import {CommentModelClass} from "../repositories/db";


class CommentsService {

    async createComment(content: string, user: userAccountDbModel, postId: string): Promise<commentViewModel> {
        const commentDb = new CommentDbModel(
            new ObjectId(),
            content,
            new Date().toISOString(),
            {
                userId: user._id.toString(),
                userLogin: user.accountData.login,
            },
            [],
            postId,
            {
                likesCount: 0,
                dislikesCount: 0,
            },
        )
        await commentsRepository.createComment(commentDb)
        return {
            id: commentDb._id.toString(),
            content: commentDb.content,
            commentatorInfo: {
                userId: commentDb.commentatorInfo.userId,
                userLogin: commentDb.commentatorInfo.userLogin
            },
            createdAt: commentDb.createdAt,
            likesInfo: {
                likesCount: commentDb.likesInfo.likesCount,
                dislikesCount: commentDb.likesInfo.dislikesCount,
                myStatus: "None"
            }
        }
    }

    async updateCommentById(id: string, content: string) {
        return await commentsRepository.updateComment(id, content)
    }

    async deleteCommentById(id: string) {
        return await commentsRepository.deleteComment(id)
    }

    async likeComment(commentId: string, likeStatus: string, user: userAccountDbModel): Promise<boolean> {
        const _id = new ObjectId(commentId)
        const commentInstance = await CommentModelClass.findOne({_id})
        if (!commentInstance) {
            return false
        }
        const userId = user._id
        const callback = (user: likingUserModel) => user.userId.toString() === userId.toString()
        const isUserLikedBefore = commentInstance.likingUsers.find(callback)
        if(!isUserLikedBefore) {
            commentInstance.likingUsers.push({userId: userId, myStatus: "None"})
            await commentInstance.save()
        }
        const indexOfUser = commentInstance.likingUsers.findIndex(callback)
        const myStatus = commentInstance.likingUsers.find(callback)!.myStatus
        switch (likeStatus) {
            case 'Like':
                if (myStatus === "Like") {
                    commentInstance.likingUsers[indexOfUser].myStatus = "Like"
                }
                if (myStatus === "None") {
                    ++commentInstance!.likesInfo.likesCount
                    commentInstance.likingUsers[indexOfUser].myStatus = "Like"
                }
                if (myStatus === "Dislike") {
                    --commentInstance!.likesInfo.dislikesCount
                    ++commentInstance!.likesInfo.likesCount
                    commentInstance.likingUsers[indexOfUser].myStatus = "Like"
                }
                break;
            case 'Dislike':
                if (myStatus === "Like") {
                    --commentInstance!.likesInfo.likesCount
                    ++commentInstance!.likesInfo.dislikesCount
                    commentInstance.likingUsers[indexOfUser].myStatus = "Dislike"
                }
                if (myStatus === "None") {
                    ++commentInstance!.likesInfo.dislikesCount
                    commentInstance.likingUsers[indexOfUser].myStatus = "Dislike"
                }
                if (myStatus === "Dislike") {
                    commentInstance.likingUsers[indexOfUser].myStatus = "Dislike"
                }
                break;
            case 'None':
                if (myStatus === "Like") {
                    --commentInstance!.likesInfo.likesCount
                    commentInstance.likingUsers[indexOfUser].myStatus = "None"
                }
                if (myStatus === "Dislike") {
                    --commentInstance!.likesInfo.dislikesCount
                    commentInstance.likingUsers[indexOfUser].myStatus = "None"
                }
                if (myStatus === "None") {
                    commentInstance.likingUsers[indexOfUser].myStatus = "None"
                }
                break;
        }
        await commentInstance.save()
        return true
    }
}
export const commentsService = new CommentsService()