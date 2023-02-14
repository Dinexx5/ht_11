import {PostsRepository} from "../repositories/posts/posts-repository-db";
import {
    createPostInputModelWithBlogId, likingUserModel, PostDbModel,
    postViewModel,
    updatePostInputModel, userAccountDbModel
} from "../models/models";
import {ObjectId} from "mongodb";
import {blogsQueryRepository} from "../repositories/blogs/blogs-query-repository";
import {PostModelClass} from "../repositories/db";

export class PostsService {
    private postsRepository: PostsRepository;
    constructor() {
        this.postsRepository = new PostsRepository()
    }
    async createPost(postBody: createPostInputModelWithBlogId): Promise<postViewModel> {
        const {title, shortDescription, content, blogId} = postBody
        let foundBlog = await blogsQueryRepository.findBlogById(blogId)
        const newDbPost = new PostDbModel(
            new ObjectId(),
            title,
            shortDescription,
            content,
            blogId,
            foundBlog!.name,
            foundBlog!.createdAt,
            [],
            [],
            {
                likesCount: 0,
                dislikesCount: 0,
            },
        )
        await this.postsRepository.createPost(newDbPost)
        return {
            id: newDbPost._id.toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: foundBlog!.name,
            createdAt: foundBlog!.createdAt,
            extendedLikesInfo: {
                likesCount: newDbPost.extendedLikesInfo.likesCount,
                dislikesCount: newDbPost.extendedLikesInfo.dislikesCount,
                myStatus: "None",
                newestLikes: []
            }
        }
    }

    async deletePostById(postId: string): Promise<boolean> {
        return await this.postsRepository.deletePostById(postId)
    }

    async UpdatePostById(postId: string, postBody: updatePostInputModel): Promise<boolean> {
        return await this.postsRepository.UpdatePostById(postId, postBody)
    }

    async likePost(postId: string, likeStatus: string, user: userAccountDbModel): Promise<boolean> {
        const _id = new ObjectId(postId)
        const postInstance = await PostModelClass.findOne({_id})
        if (!postInstance) {
            return false
        }
        const userId = user._id
        const login = user.accountData.login
        const callback = (user: likingUserModel) => user.userId.toString() === userId.toString()
        if (likeStatus === "Like") {

        }
        const isUserLikedBefore = postInstance.likingUsers.find(callback)
        if(!isUserLikedBefore) {
            postInstance.likingUsers.push({userId: userId, myStatus: "None"})
            await postInstance.save()
        }
        const indexOfUser = postInstance.likingUsers.findIndex(callback)
        const myStatus = postInstance.likingUsers.find(callback)!.myStatus
        switch (likeStatus) {
            case 'Like':
                if (myStatus === "Like") {
                    postInstance.likingUsers[indexOfUser].myStatus = "Like"
                }
                if (myStatus === "None") {
                    ++postInstance!.extendedLikesInfo.likesCount
                    postInstance.likingUsers[indexOfUser].myStatus = "Like"
                    postInstance.likes.push({addedAt: new Date().toISOString(), userId: userId.toString(), login: login})
                }
                if (myStatus === "Dislike") {
                    --postInstance!.extendedLikesInfo.dislikesCount
                    ++postInstance!.extendedLikesInfo.likesCount
                    postInstance.likingUsers[indexOfUser].myStatus = "Like"
                    postInstance.likes.push({addedAt: new Date().toISOString(), userId: userId.toString(), login: login})
                }
                break;
            case 'Dislike':
                if (myStatus === "Like") {
                    --postInstance!.extendedLikesInfo.likesCount
                    ++postInstance!.extendedLikesInfo.dislikesCount
                    postInstance.likingUsers[indexOfUser].myStatus = "Dislike"
                    postInstance.likes = postInstance.likes.filter(like => like.userId !== userId.toString())
                }
                if (myStatus === "None") {
                    ++postInstance!.extendedLikesInfo.dislikesCount
                    postInstance.likingUsers[indexOfUser].myStatus = "Dislike"
                }
                if (myStatus === "Dislike") {
                    postInstance.likingUsers[indexOfUser].myStatus = "Dislike"
                }
                break;
            case 'None':
                if (myStatus === "Like") {
                    --postInstance!.extendedLikesInfo.likesCount
                    postInstance.likingUsers[indexOfUser].myStatus = "None"
                    postInstance.likes = postInstance.likes.filter(like => like.userId !== userId.toString())
                }
                if (myStatus === "Dislike") {
                    --postInstance!.extendedLikesInfo.dislikesCount
                    postInstance.likingUsers[indexOfUser].myStatus = "None"
                }
                if (myStatus === "None") {
                    postInstance.likingUsers[indexOfUser].myStatus = "None"
                }
                break;
        }
        await postInstance.save()
        return true
    }
}
export const postsService = new PostsService()


