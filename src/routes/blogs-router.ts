import {Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {
    postContentValidation, descriptionValidation,
    inputValidationMiddleware, nameValidation, objectIdIsValidMiddleware,
    shortDescriptionValidation, titleValidation, websiteUrlValidation, blogIdParamsValidation
} from "../middlewares/input-validation";

import {
    RequestWithQuery, RequestWithParams, RequestWithBody,
    RequestWithParamsAndBody, RequestWithParamsAndQuery
} from "../models/types";

import {blogsQueryRepository} from "../repositories/blogs/blogs-query-repository";
import {postsService} from "../domain/posts-service";
import {postsQueryRepository} from "../repositories/posts/posts-query-repository";
import {
    blogViewModel,
    createBlogInputModel,
    paginationQuerys,
    paramsIdModel,
    postViewModel,
    updateBlogInputModel,
    createPostInputModel, paginatedViewModel
} from "../models/models";
import {basicAuthMiddleware} from "../middlewares/auth-middlewares";



export const blogsRouter = Router({})


blogsRouter.get('/',
    async (req: RequestWithQuery<paginationQuerys>, res: Response<paginatedViewModel<blogViewModel[]>>) => {
    const returnedBlogs: paginatedViewModel<blogViewModel[]> = await blogsQueryRepository.getAllBlogs(req.query)
    res.send(returnedBlogs)
})

blogsRouter.get('/:id',
    objectIdIsValidMiddleware,
    async (req: RequestWithParams<paramsIdModel>, res: Response) => {
    const blog: blogViewModel | null = await blogsQueryRepository.findBlogById(req.params.id)
    if (!blog) {
        return res.sendStatus(404)
    }
    res.send(blog)
})

blogsRouter.get('/:id/posts',
    objectIdIsValidMiddleware,
    blogIdParamsValidation,
    async (req: RequestWithParamsAndQuery<paramsIdModel, paginationQuerys>, res: Response) => {
    const foundPosts: paginatedViewModel<postViewModel[]> = await postsQueryRepository.getPosts(req.query, req.params.id)
    res.send(foundPosts)
})


blogsRouter.post('/:id/posts',
    basicAuthMiddleware,
    titleValidation,
    shortDescriptionValidation,
    postContentValidation,
    inputValidationMiddleware,
    blogIdParamsValidation,
    async (req: RequestWithParamsAndBody<paramsIdModel, createPostInputModel>, res: Response) => {
    const blogId = req.params.id
    const postBody = {...req.body, blogId}
    const newPost: postViewModel = await postsService.createPost(postBody)
    res.status(201).send(newPost)

})

blogsRouter.post('/',
    basicAuthMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    async (req: RequestWithBody<createBlogInputModel>, res: Response<blogViewModel>) => {

    const newBlog: blogViewModel = await blogsService.createBlog(req.body)
    res.status(201).send(newBlog)
})

blogsRouter.delete('/:id',
    basicAuthMiddleware,
    objectIdIsValidMiddleware,
    async (req: RequestWithParams<paramsIdModel>, res: Response) => {
    const isDeleted: boolean = await blogsService.deleteBlogById(req.params.id)
    if (!isDeleted) {
       return res.sendStatus(404)
    }
    return res.sendStatus(204)
})

blogsRouter.put('/:id',
    basicAuthMiddleware,
    objectIdIsValidMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<paramsIdModel, updateBlogInputModel>, res: Response) => {

    let isUpdated: boolean = await blogsService.UpdateBlogById(req.params.id, req.body)
    if (!isUpdated) {
        return res.sendStatus(404)
    }
    return res.sendStatus(204)
})