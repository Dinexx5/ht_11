import {Request, Response, Router} from "express"
import {jwtService} from "../application/jwt-service";
import {devicesRepository} from "../repositories/devices/devices-repository";
import {checkRefreshTokenMiddleware} from "../middlewares/auth-middlewares";


export const devicesRouter = Router({})

class DevicesController {
    async getActiveSessions (req: Request, res: Response){
        const refreshToken = req.cookies.refreshToken
        const result = await jwtService.getRefreshTokenInfo(refreshToken)
        const userId = result.userId
        const foundDevices = await devicesRepository.getActiveSessions(userId)
        return res.send(foundDevices)
    }
    async deleteAllSessions (req: Request, res: Response){
        const refreshToken = req.cookies.refreshToken
        const result: any = await jwtService.getRefreshTokenInfo(refreshToken)
        const {deviceId, userId} = result
        const isDeleted: boolean = await devicesRepository.deleteAllSessions(deviceId, userId)
        if (!isDeleted) {
            console.log('Something wrong with delete operation')
        }
        return res.send(204)
    }
    async deleteSession (req: Request, res: Response){
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
    }
}

export const devicesControllerInstance = new DevicesController()

devicesRouter.get('/',
    checkRefreshTokenMiddleware,
    devicesControllerInstance.getActiveSessions.bind(devicesControllerInstance)
)

devicesRouter.delete('/',
    checkRefreshTokenMiddleware,
    devicesControllerInstance.deleteAllSessions.bind(devicesControllerInstance)
)

devicesRouter.delete('/:deviceId',
    checkRefreshTokenMiddleware,
    devicesControllerInstance.deleteSession.bind(devicesControllerInstance)
)