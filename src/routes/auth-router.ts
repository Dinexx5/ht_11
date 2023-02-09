import {Request, Response, Router} from "express"
import {RequestWithBody} from "../models/types";
import {
    authInputModel,
    createUserInputModel, passwordRecoveryModel,
    registrationConfirmationInput,
    resendEmailModel,
} from "../models/models";
import {
    confirmationCodeValidation, recoveryCodeValidation,
    emailValidation, emailValidationForPasswordRecovery, emailValidationForResending,
    inputValidationMiddleware,
    loginOrEmailValidation, loginValidation, newPasswordValidation,
    passwordAuthValidation, passwordValidation,
} from "../middlewares/input-validation";
import {jwtService} from "../application/jwt-service";
import {bearerAuthMiddleware, checkRefreshTokenMiddleware} from "../middlewares/auth-middlewares";
import {authService} from "../domain/auth-service";
import {
    limiter
} from "../middlewares/rate-limit-middleware";
import {devicesService} from "../domain/devices-service";



export const authRouter = Router({})


//emails

authRouter.post('/registration',
    limiter,
    loginValidation,
    emailValidation,
    passwordValidation,
    inputValidationMiddleware,
    async(req: RequestWithBody<createUserInputModel>, res: Response) => {

    const createdAccount = await authService.createUser(req.body)
    if (!createdAccount) {
        res.send({"errorsMessages": 'can not send email. try later'})
        return
    }
    return res.send(204)

})

authRouter.post('/registration-email-resending',
    limiter,
    emailValidationForResending,
    inputValidationMiddleware,
    async(req: RequestWithBody<resendEmailModel>, res: Response) => {

    const isEmailResend = await authService.resendEmail(req.body.email)

    if (!isEmailResend) {
        res.send({"errorsMessages": 'can not send email. try later'})
        return
    }
    res.send(204)

})

authRouter.post('/registration-confirmation',
    limiter,
    confirmationCodeValidation,
    inputValidationMiddleware,
    async(req: RequestWithBody<registrationConfirmationInput>, res: Response) => {

    const isConfirmed = await authService.confirmEmail(req.body.code)
    if (!isConfirmed) {
        return res.send(400)
    }
    res.send(204)

})


authRouter.post('/login',
    limiter,
    loginOrEmailValidation,
    passwordAuthValidation,
    inputValidationMiddleware,
    async(req: RequestWithBody<authInputModel>, res: Response) => {
    const user = await authService.checkCredentials(req.body)
    if (!user) {
        res.clearCookie('refreshToken')
        return res.send(401)
    }
    const ip = req.ip
    const deviceName = req.headers['user-agent']!
    const accessToken = await jwtService.createJWTAccessToken(user)
    const refreshToken = await jwtService.createJWTRefreshToken(user,deviceName,ip)
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true
    })
    res.json({'accessToken': accessToken})

})

authRouter.post('/password-recovery',
    limiter,
    emailValidationForPasswordRecovery,
    inputValidationMiddleware,
    async(req: RequestWithBody<resendEmailModel>, res: Response) => {

        const isEmailSent = await authService.sendEmailForPasswordRecovery(req.body.email)

        if (!isEmailSent) {
            res.status(204).send('Can not send an email')
            return
        }
        res.sendStatus(204)

    })

authRouter.post('/new-password',
    limiter,
    newPasswordValidation,
    recoveryCodeValidation,
    inputValidationMiddleware,
    async(req: RequestWithBody<passwordRecoveryModel>, res: Response) => {

       const isPasswordUpdated = authService.updatePassword(req.body.newPassword, req.body.recoveryCode)

        if (!isPasswordUpdated) {
            res.send('something went wrong with the password change')
            return
        }
        res.sendStatus(204)

    })


authRouter.post('/refresh-token',
    checkRefreshTokenMiddleware,
    async(req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        const user = await jwtService.getUserByRefreshToken(refreshToken)
        const newAccessToken = await jwtService.createJWTAccessToken(user)
        const newRefreshToken = await jwtService.updateJWTRefreshToken(refreshToken)
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true
        })
        res.json({'accessToken': newAccessToken})

    })

authRouter.post('/logout',
    checkRefreshTokenMiddleware,
    async(req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        await jwtService.deleteSession(refreshToken)
        await devicesService.deleteDevice(refreshToken)
        res.clearCookie('refreshToken')
        return res.send(204)

    })

authRouter.get('/me',
    bearerAuthMiddleware,
    async(req: Request, res: Response) => {
        const user = req.user!;
        res.send({
            "email": user.accountData.email,
            "login": user.accountData.login,
            "userId": user._id.toString()
        })
    })