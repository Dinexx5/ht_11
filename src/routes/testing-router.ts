import {Request, Response, Router} from "express";
import {
    BlogModelClass,
    CommentModelClass,
    DeviceModelClass,PostModelClass,
    TokenModel,
    UserModel,
} from "../repositories/db";
export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await BlogModelClass.deleteMany( {} )
    await PostModelClass.deleteMany( {} )
    await CommentModelClass.deleteMany( {} )
    await UserModel.deleteMany( {} )
    await TokenModel.deleteMany( {} )
    await DeviceModelClass.deleteMany( {} )
    return res.sendStatus(204)
})