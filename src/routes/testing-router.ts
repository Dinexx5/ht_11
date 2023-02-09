import {Request, Response, Router} from "express";
import {
    BlogModelClass,
    CommentModel,
    DeviceModel,PostModel,
    TokenModel,
    UserModel,
} from "../repositories/db";
export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await BlogModelClass.deleteMany( {} )
    await PostModel.deleteMany( {} )
    await CommentModel.deleteMany( {} )
    await UserModel.deleteMany( {} )
    await TokenModel.deleteMany( {} )
    await DeviceModel.deleteMany( {} )
    return res.sendStatus(204)
})