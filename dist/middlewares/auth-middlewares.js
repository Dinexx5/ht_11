"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRefreshTokenMiddleware = exports.getCommentAuthMiddleware = exports.bearerAuthMiddleware = exports.basicAuthMiddleware = void 0;
const jwt_service_1 = require("../application/jwt-service");
const users_service_1 = require("../domain/users-service");
const basicAuthMiddleware = (req, res, next) => {
    const loginPass = req.headers.authorization;
    if (loginPass === "Basic YWRtaW46cXdlcnR5") {
        next();
    }
    else {
        return res.status(401).send("access forbidden");
    }
};
exports.basicAuthMiddleware = basicAuthMiddleware;
const bearerAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        return res.status(401).send("no token provided");
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByAccessToken(token);
    if (userId) {
        req.user = yield users_service_1.usersService.findUserById(userId);
        next();
        return;
    }
    return res.status(401).send("user not found");
});
exports.bearerAuthMiddleware = bearerAuthMiddleware;
const getCommentAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        return next();
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByAccessToken(token);
    if (userId) {
        req.user = yield users_service_1.usersService.findUserById(userId);
        next();
        return;
    }
    return res.status(401).send("user not found");
});
exports.getCommentAuthMiddleware = getCommentAuthMiddleware;
const checkRefreshTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!req.cookies.refreshToken) {
        res.send(401);
        return;
    }
    const isRefreshTokenActive = yield jwt_service_1.jwtService.checkRefreshTokenInDb(refreshToken);
    if (!isRefreshTokenActive) {
        res.send(401);
        return;
    }
    return next();
});
exports.checkRefreshTokenMiddleware = checkRefreshTokenMiddleware;
