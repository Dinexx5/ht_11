import {Response, Router} from "express"
import {commentsService} from "../domain/comments-service";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {
    RequestWithParams,
    RequestWithParamsAndBody,
} from "../models/types";
import {
    commentViewModel, createCommentInputModel, likeInputModel,
    paramsIdModel,
} from "../models/models";

import {
    commentContentValidation,
    inputValidationMiddleware, isLikeStatusCorrect,
    objectIdIsValidMiddleware
} from "../middlewares/input-validation";
import {bearerAuthMiddleware, authUserForCommentsMiddleware} from "../middlewares/auth-middlewares";


export const commentsRouter = Router({})

class CommentsController {
    async getComment (req: RequestWithParams<paramsIdModel>, res: Response){
        // const user = req.user
        // if (!user) {
        //    const returnedComment = await commentsQueryRepository.findCommentById(req.params.id)
        //     if (!returnedComment) {
        //         return res.sendStatus(404)
        //     }
        //     return res.send(returnedComment)
        // }
        const returnedComment: commentViewModel | null = await commentsQueryRepository.findCommentById(req.params.id, req.user)
        if (!returnedComment) {
        return res.sendStatus(404)
        }
        return res.send(returnedComment)
    }

    async updateComment (req: RequestWithParamsAndBody<paramsIdModel, createCommentInputModel>, res: Response) {
        const comment: commentViewModel | null = await commentsQueryRepository.findCommentById(req.params.id, req.user!)
        if (!comment) {
        return res.sendStatus(404)
        }
        if (comment.commentatorInfo.userId !== req.user!._id.toString()) {
        return  res.sendStatus(403)
        }
        const isUpdated = await commentsService.updateCommentById(req.params.id, req.body.content)

        if (!isUpdated) {
            return res.sendStatus(404)
        }
        return res.sendStatus(204)
    }
    async deleteComment (req: RequestWithParams<paramsIdModel>, res: Response)  {
        const comment: commentViewModel | null = await commentsQueryRepository.findCommentById(req.params.id, req.user!)
        if (!comment) {
        return res.sendStatus(404)
        }
        if (comment.commentatorInfo.userId !== req.user!._id.toString()) {
       return res.sendStatus(403)
        }
        const isDeleted: boolean = await commentsService.deleteCommentById(req.params.id)
        if (!isDeleted) {
           return res.sendStatus(404)
        }
        return res.sendStatus(204)
    }
    async likeComment (req: RequestWithParamsAndBody<paramsIdModel, likeInputModel>, res: Response) {
        const isLiked = await commentsService.likeComment(req.params.id, req.body.likeStatus, req.user!)
        if (!isLiked) {
            return res.sendStatus(404)
        }
        return res.sendStatus(204)
    }
}

export const commentsControllerInstance = new CommentsController()

commentsRouter.get('/:id',
    authUserForCommentsMiddleware,
    objectIdIsValidMiddleware,
    commentsControllerInstance.getComment.bind(commentsControllerInstance)
)

commentsRouter.put('/:id',
    bearerAuthMiddleware,
    objectIdIsValidMiddleware,
    commentContentValidation,
    inputValidationMiddleware,
    commentsControllerInstance.updateComment.bind(commentsControllerInstance)
)

commentsRouter.delete('/:id',
    bearerAuthMiddleware,
    objectIdIsValidMiddleware,
    commentsControllerInstance.deleteComment.bind(commentsControllerInstance)
)

commentsRouter.put('/:id/like-status',
    bearerAuthMiddleware,
    objectIdIsValidMiddleware,
    isLikeStatusCorrect,
    inputValidationMiddleware,
    commentsControllerInstance.likeComment.bind(commentsControllerInstance)
)

