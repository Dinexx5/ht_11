import {Response, Router} from "express";
import {BlogsService} from "../domain/blogs-service";
import {
    postContentValidation, descriptionValidation,
    inputValidationMiddleware, nameValidation, objectIdIsValidMiddleware,
    shortDescriptionValidation, titleValidation, websiteUrlValidation, blogIdParamsValidation
} from "../middlewares/input-validation";

import {
    RequestWithQuery, RequestWithParams, RequestWithBody,
    RequestWithParamsAndBody, RequestWithParamsAndQuery
} from "../models/types";

import {blogsQueryRepository, BlogsQueryRepository} from "../repositories/blogs/blogs-query-repository";
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
import {authUserToGetLikeStatus, basicAuthMiddleware} from "../middlewares/auth-middlewares";

export const blogsRouter = Router({})

class BlogsController {
    blogsService: BlogsService
    constructor() {
        this.blogsService = new BlogsService
    }
    async getBlogs (req: RequestWithQuery<paginationQuerys>, res: Response<paginatedViewModel<blogViewModel[]>>){
        const returnedBlogs: paginatedViewModel<blogViewModel[]> = await blogsQueryRepository.getAllBlogs(req.query)
        res.send(returnedBlogs)
    }

    async getBlog (req: RequestWithParams<paramsIdModel>, res: Response){
        const blog: blogViewModel | null = await blogsQueryRepository.findBlogById(req.params.id)
        if (!blog) {
            return res.sendStatus(404)
        }
        res.send(blog)
    }

    async createBlog (req: RequestWithBody<createBlogInputModel>, res: Response<blogViewModel>){
        const newBlog: blogViewModel = await this.blogsService.createBlog(req.body)
        res.status(201).send(newBlog)
    }

    async updateBlog (req: RequestWithParamsAndBody<paramsIdModel, updateBlogInputModel>, res: Response){
        let isUpdated: boolean = await this.blogsService.UpdateBlogById(req.params.id, req.body)
        if (!isUpdated) {
            return res.sendStatus(404)
        }
        return res.sendStatus(204)
    }

    async deleteBlog (req: RequestWithParams<paramsIdModel>, res: Response){
        const isDeleted: boolean = await this.blogsService.deleteBlogById(req.params.id)
        if (!isDeleted) {
        return res.sendStatus(404)
        }
        return res.sendStatus(204)
    }

    async createPost (req: RequestWithParamsAndBody<paramsIdModel, createPostInputModel>, res: Response) {
        const blogId = req.params.id
        const postBody = {...req.body, blogId}
        const newPost: postViewModel = await postsService.createPost(postBody)
        res.status(201).send(newPost)
    }

    async getPosts(req: RequestWithParamsAndQuery<paramsIdModel, paginationQuerys>, res: Response) {
        const foundPosts: paginatedViewModel<postViewModel[]> = await postsQueryRepository.getAllPosts(req.query, req.params.id, req.user)
        res.send(foundPosts)
    }
}

export const blogsControllerInstance = new BlogsController()

blogsRouter.get('/', blogsControllerInstance.getBlogs.bind(blogsControllerInstance))

blogsRouter.get('/:id',
    objectIdIsValidMiddleware,
    blogsControllerInstance.getBlog.bind(blogsControllerInstance))

blogsRouter.get('/:id/posts',
    authUserToGetLikeStatus,
    objectIdIsValidMiddleware,
    blogIdParamsValidation,
    blogsControllerInstance.getPosts.bind(blogsControllerInstance))


blogsRouter.post('/:id/posts',
    basicAuthMiddleware,
    titleValidation,
    shortDescriptionValidation,
    postContentValidation,
    inputValidationMiddleware,
    blogIdParamsValidation,
    blogsControllerInstance.createPost.bind(blogsControllerInstance))

blogsRouter.post('/',
    basicAuthMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    blogsControllerInstance.createBlog.bind(blogsControllerInstance))

blogsRouter.delete('/:id',
    basicAuthMiddleware,
    objectIdIsValidMiddleware,
    blogsControllerInstance.deleteBlog.bind(blogsControllerInstance))

blogsRouter.put('/:id',
    basicAuthMiddleware,
    objectIdIsValidMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    blogsControllerInstance.updateBlog.bind(blogsControllerInstance))