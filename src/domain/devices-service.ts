import {jwtService} from "../application/jwt-service";
import {devicesRepository} from "../repositories/devices/devices-repository";

export const devicesService = {
    async deleteDevice(refreshToken: string):Promise<boolean> {
        const result: any = await jwtService.getRefreshTokenInfo(refreshToken)
        const deviceId = result.deviceId
        return await devicesRepository.deleteSessionById(deviceId)
    }
}