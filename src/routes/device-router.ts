import {Request, Response, Router} from "express"
import {jwtService} from "../application/jwt-service";
import {devicesRepository} from "../repositories/devices/devices-repository";
import {checkRefreshTokenMiddleware} from "../middlewares/auth-middlewares";


export const devicesRouter = Router({})

devicesRouter.get('/',
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) =>{
    const refreshToken = req.cookies.refreshToken
    const result = await jwtService.getRefreshTokenInfo(refreshToken)
    const userId = result.userId
    const foundDevices = await devicesRepository.getActiveSessions(userId)
    return res.send(foundDevices)
})

devicesRouter.delete('/',
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const result: any = await jwtService.getRefreshTokenInfo(refreshToken)
    const {deviceId, userId} = result
    const isDeleted: boolean = await devicesRepository.deleteAllSessions(deviceId, userId)
    if (!isDeleted) {
        console.log('Something wrong with delete operation')
    }
    return res.send(204)
})

devicesRouter.delete('/:deviceId',
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const result: any = await jwtService.getRefreshTokenInfo(refreshToken)
    const {userId} = result
    const foundDevice = await devicesRepository.findDeviceByDeviceId(req.params.deviceId)
    if (!foundDevice) {
        return res.send(404)
    }
    if (foundDevice.userId.toString() !== userId) {
        return res.send(403)
    }
    const isDeleted: boolean = await devicesRepository.deleteSessionById(req.params.deviceId)
    if (!isDeleted) {
        console.log('Something wrong with delete operation')
    }
    return res.send(204)
})