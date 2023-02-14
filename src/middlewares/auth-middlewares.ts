import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const loginPass = req.headers.authorization;
    if (loginPass === "Basic YWRtaW46cXdlcnR5") {
        next()
    } else {
        return res.status(401).send("access forbidden")
    }
}

export const bearerAuthMiddleware = async (req:Request, res:Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.status(401).send("no token provided")
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByAccessToken(token)
    if (userId) {
        req.user = await usersService.findUserById(userId)
        next ()
        return
    }
    return res.status(401).send("user not found")
}

export const authUserToGetLikeStatus = async (req:Request, res:Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return next()
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByAccessToken(token)
    if (userId) {
        req.user = await usersService.findUserById(userId)
        next ()
        return
    }
    return res.status(401).send("user not found")
}

export const checkRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!req.cookies.refreshToken) {
        res.send(401)
        return
    }
    const isRefreshTokenActive: boolean = await jwtService.checkRefreshTokenInDb(refreshToken)
    if(!isRefreshTokenActive) {
        res.send(401)
        return
    }
    return next()
}