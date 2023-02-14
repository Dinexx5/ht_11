import {Response, Router} from "express"

import {
    blogIdlValidation, commentContentValidation, postContentValidation,
    inputValidationMiddleware, objectIdIsValidMiddleware,
    shortDescriptionValidation, titleValidation, isLikeStatusCorrect
} from "../middlewares/input-validation";

import {postsService} from "../domain/posts-service";

import {
    RequestWithBody, RequestWithParams,
    RequestWithParamsAndBody, RequestWithParamsAndQuery, RequestWithQuery
} from "../models/types";

import {postsQueryRepository} from "../repositories/posts/posts-query-repository";

import {
    commentViewModel,
    createCommentInputModel,
    paramsIdModel,
    postViewModel,
    updatePostInputModel,
    createPostInputModelWithBlogId,
    paginationQuerys,
    paginatedViewModel, likeInputModel
} from "../models/models";
import {commentsService} from "../domain/comments-service";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {basicAuthMiddleware, bearerAuthMiddleware, authUserToGetLikeStatus} from "../middlewares/auth-middlewares";


export const postsRouter = Router({})


class PostsController {

    async getPosts (req: RequestWithQuery<paginationQuerys>, res: Response<paginatedViewModel<postViewModel[]>>) {
        const returnedPosts: paginatedViewModel<postViewModel[]> = await postsQueryRepository.getAllPosts(req.query, undefined, req.user)
        return res.status(200).send(returnedPosts)
    }

    async getPost (req: RequestWithParams<paramsIdModel>, res: Response){
        let foundPost: postViewModel | null = await postsQueryRepository.findPostById(req.params.id, req.user)
        if (!foundPost) {
        return res.sendStatus(404)
        }
        return res.send(foundPost)
    }

    async createPost (req: RequestWithBody<createPostInputModelWithBlogId>, res: Response<postViewModel>) {
        const newPost: postViewModel = await postsService.createPost(req.body)
        return res.status(201).send(newPost)
    }

    async deletePost (req: RequestWithParams<paramsIdModel>, res: Response) {
        const isDeleted: boolean = await postsService.deletePostById(req.params.id)
        if (!isDeleted) {
        return res.sendStatus(404)
        }
        return res.sendStatus(204)
    }

    async updatePost (req: RequestWithParamsAndBody<paramsIdModel, updatePostInputModel>, res: Response)  {
        let isUpdated: boolean = await postsService.UpdatePostById(req.params.id, req.body)
        if (!isUpdated) {
        return res.sendStatus(404)
        }
        return res.sendStatus(204)
    }

    async createComment (req:RequestWithParamsAndBody<paramsIdModel, createCommentInputModel>, res: Response) {
        const foundPost: postViewModel | null = await postsQueryRepository.findPostById(req.params.id)
        if (!foundPost) {
        return res.sendStatus(404)
        }
        const newComment: commentViewModel = await commentsService.createComment(req.body.content, req.user!, req.params.id)
        return res.status(201).send(newComment)
    }

    async getComments (req: RequestWithParamsAndQuery<paramsIdModel, paginationQuerys>, res: Response) {
        const foundPost: postViewModel | null = await postsQueryRepository.findPostById(req.params.id)
        if (!foundPost) {
        return res.sendStatus(404)
        }
        const returnedComments: paginatedViewModel<commentViewModel[]> = await commentsQueryRepository.getAllCommentsForPost(req.query, req.params.id, req.user)
        return res.send(returnedComments)
    }
    async likePost (req: RequestWithParamsAndBody<paramsIdModel, likeInputModel>, res: Response) {
        const isLiked = await postsService.likePost(req.params.id, req.body.likeStatus, req.user!)
        if (!isLiked) {
            return res.sendStatus(404)
        }
        return res.sendStatus(204)
    }
}

export const postsControllerInstance = new PostsController()

postsRouter.get('/',
    authUserToGetLikeStatus,
    postsControllerInstance.getPosts.bind(postsControllerInstance))

postsRouter.get('/:id',
    authUserToGetLikeStatus,
    objectIdIsValidMiddleware,
    postsControllerInstance.getPost.bind(postsControllerInstance)
)

postsRouter.post('/',
    basicAuthMiddleware,
    titleValidation,
    shortDescriptionValidation,
    postContentValidation,
    blogIdlValidation,
    inputValidationMiddleware,
    postsControllerInstance.createPost.bind(postsControllerInstance)
)

postsRouter.delete('/:id',
    basicAuthMiddleware,
    objectIdIsValidMiddleware,
    postsControllerInstance.deletePost.bind(postsControllerInstance)
)

postsRouter.put('/:id',
    basicAuthMiddleware,
    objectIdIsValidMiddleware,
    titleValidation,
    shortDescriptionValidation,
    postContentValidation,
    blogIdlValidation,
    inputValidationMiddleware,
    postsControllerInstance.updatePost.bind(postsControllerInstance)
)

postsRouter.post('/:id/comments',
    bearerAuthMiddleware,
    commentContentValidation,
    inputValidationMiddleware,
    postsControllerInstance.createComment.bind(postsControllerInstance)
)

postsRouter.get('/:id/comments',
    authUserToGetLikeStatus,
    postsControllerInstance.getComments.bind(postsControllerInstance)
)

postsRouter.put('/:id/like-status',
    bearerAuthMiddleware,
    objectIdIsValidMiddleware,
    isLikeStatusCorrect,
    inputValidationMiddleware,
    postsControllerInstance.likePost.bind(postsControllerInstance)
)