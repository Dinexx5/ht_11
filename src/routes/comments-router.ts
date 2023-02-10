import {Response, Router} from "express"
import {commentsService} from "../domain/comments-service";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {
    RequestWithParams,
    RequestWithParamsAndBody,
} from "../models/types";
import {
    commentViewModel, createCommentInputModel,
    paramsIdModel,
} from "../models/models";

import {
    commentContentValidation,
    inputValidationMiddleware,
    objectIdIsValidMiddleware
} from "../middlewares/input-validation";
import {bearerAuthMiddleware} from "../middlewares/auth-middlewares";


export const commentsRouter = Router({})

class CommentsController {
    async getComments (req: RequestWithParams<paramsIdModel>, res: Response){
        const returnedComment: commentViewModel | null = await commentsQueryRepository.findCommentById(req.params.id)
        if (!returnedComment) {
        res.send(404)
        return
        }
        res.send(returnedComment)
    }

    async createComment (req: RequestWithParamsAndBody<paramsIdModel, createCommentInputModel>, res: Response) {
        const comment: commentViewModel | null = await commentsQueryRepository.findCommentById(req.params.id)
        if (!comment) {
        res.send(404)
        return
        }
        if (comment.userId !== req.user!._id.toString()) {
            res.send(403)
            return
        }
        const isUpdated = await commentsService.updateCommentById(req.params.id, req.body.content)

        if (!isUpdated) {
            res.send(404)
        }
        res.send(204)
    }
    async deleteComment (req: RequestWithParams<paramsIdModel>, res: Response)  {
        const comment: commentViewModel | null = await commentsQueryRepository.findCommentById(req.params.id)
        if (!comment) {
        res.send(404)
        return
        }
        if (comment.userId !== req.user!._id.toString()) {
            res.send(403)
            return
        }
        const isDeleted: boolean = await commentsService.deleteCommentById(req.params.id)
        if (!isDeleted) {
            res.send(404)
        }
        res.send(204)
    }
}

export const commentsControllerInstance = new CommentsController()

commentsRouter.get('/:id',
    objectIdIsValidMiddleware,
    commentsControllerInstance.getComments.bind(commentsControllerInstance)
)

commentsRouter.put('/:id',
    bearerAuthMiddleware,
    objectIdIsValidMiddleware,
    commentContentValidation,
    inputValidationMiddleware,
    commentsControllerInstance.createComment.bind(commentsControllerInstance)
)

commentsRouter.delete('/:id',
    bearerAuthMiddleware,
    objectIdIsValidMiddleware,
    commentsControllerInstance.deleteComment.bind(commentsControllerInstance)
)

