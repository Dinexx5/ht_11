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
exports.authRouter = void 0;
const express_1 = require("express");
const input_validation_1 = require("../middlewares/input-validation");
const jwt_service_1 = require("../application/jwt-service");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
const auth_service_1 = require("../domain/auth-service");
const rate_limit_middleware_1 = require("../middlewares/rate-limit-middleware");
const devices_service_1 = require("../domain/devices-service");
exports.authRouter = (0, express_1.Router)({});
//emails
exports.authRouter.post('/registration', rate_limit_middleware_1.limiter, input_validation_1.loginValidation, input_validation_1.emailValidation, input_validation_1.passwordValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdAccount = yield auth_service_1.authService.createUser(req.body);
    if (!createdAccount) {
        res.send({ "errorsMessages": 'can not send email. try later' });
        return;
    }
    return res.send(204);
}));
exports.authRouter.post('/registration-email-resending', rate_limit_middleware_1.limiter, input_validation_1.emailValidationForResending, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isEmailResend = yield auth_service_1.authService.resendEmail(req.body.email);
    if (!isEmailResend) {
        res.send({ "errorsMessages": 'can not send email. try later' });
        return;
    }
    res.send(204);
}));
exports.authRouter.post('/registration-confirmation', rate_limit_middleware_1.limiter, input_validation_1.confirmationCodeValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isConfirmed = yield auth_service_1.authService.confirmEmail(req.body.code);
    if (!isConfirmed) {
        return res.send(400);
    }
    res.send(204);
}));
exports.authRouter.post('/login', rate_limit_middleware_1.limiter, input_validation_1.loginOrEmailValidation, input_validation_1.passwordAuthValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_service_1.authService.checkCredentials(req.body);
    if (!user) {
        res.clearCookie('refreshToken');
        return res.send(401);
    }
    const ip = req.ip;
    const deviceName = req.headers['user-agent'];
    const accessToken = yield jwt_service_1.jwtService.createJWTAccessToken(user);
    const refreshToken = yield jwt_service_1.jwtService.createJWTRefreshToken(user, deviceName, ip);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true
    });
    res.json({ 'accessToken': accessToken });
}));
exports.authRouter.post('/password-recovery', rate_limit_middleware_1.limiter, input_validation_1.emailValidationForPasswordRecovery, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isEmailSent = yield auth_service_1.authService.sendEmailForPasswordRecovery(req.body.email);
    if (!isEmailSent) {
        res.status(204).send('Can not send an email');
        return;
    }
    res.sendStatus(204);
}));
exports.authRouter.post('/new-password', rate_limit_middleware_1.limiter, input_validation_1.newPasswordValidation, input_validation_1.recoveryCodeValidation, input_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isPasswordUpdated = auth_service_1.authService.updatePassword(req.body.newPassword, req.body.recoveryCode);
    if (!isPasswordUpdated) {
        res.send('something went wrong with the password change');
        return;
    }
    res.sendStatus(204);
}));
exports.authRouter.post('/refresh-token', auth_middlewares_1.checkRefreshTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const user = yield jwt_service_1.jwtService.getUserByRefreshToken(refreshToken);
    const newAccessToken = yield jwt_service_1.jwtService.createJWTAccessToken(user);
    const newRefreshToken = yield jwt_service_1.jwtService.updateJWTRefreshToken(refreshToken);
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true
    });
    res.json({ 'accessToken': newAccessToken });
}));
exports.authRouter.post('/logout', auth_middlewares_1.checkRefreshTokenMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    yield jwt_service_1.jwtService.deleteSession(refreshToken);
    yield devices_service_1.devicesService.deleteDevice(refreshToken);
    res.clearCookie('refreshToken');
    return res.send(204);
}));
exports.authRouter.get('/me', auth_middlewares_1.bearerAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.send({
        "email": user.accountData.email,
        "login": user.accountData.login,
        "userId": user._id.toString()
    });
}));
