import {deviceDbModel, refreshTokenDbModel, userAccountDbModel} from "../models/models";
import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {settings} from "../settings";
import {jwtRepository} from "../repositories/jwt-repository";
import {devicesRepository} from "../repositories/devices/devices-repository";
import {devicesService} from "../domain/devices-service";
import {usersRepository} from "../repositories/users/users-repository-db";



export const jwtService = {

    async createJWTAccessToken(user: userAccountDbModel): Promise<string> {
        return jwt.sign({userId: user._id}, settings.JWT_ACCESS_SECRET, {expiresIn: "10s"})

    },

    async createJWTRefreshToken(user: userAccountDbModel, deviceName: string, ip: string): Promise<string> {

        const deviceId = new Date().toISOString()
        const refreshToken = jwt.sign({userId: user._id, deviceId: deviceId}, settings.JWT_REFRESH_SECRET, {expiresIn: "20s"})
        const result = await this.getRefreshTokenInfo(refreshToken)
        const issuedAt = new Date(result.iat*1000).toISOString()
        const expiredAt = new Date(result.exp*1000).toISOString()

        const tokenMeta: refreshTokenDbModel = {
            _id: new ObjectId(),
            issuedAt: issuedAt,
            userId: user._id,
            deviceId: deviceId,
            deviceName: deviceName,
            ip: ip,
            expiredAt: expiredAt

        }
        await jwtRepository.saveRefreshTokenMeta(tokenMeta)
        const newDevice: deviceDbModel = {
            _id: new ObjectId(),
            userId: user._id,
            ip: ip,
            title: deviceName,
            lastActiveDate: issuedAt,
            deviceId: deviceId
        }
        await devicesRepository.saveNewDevice(newDevice)
        return refreshToken

    },
    async updateJWTRefreshToken(refreshToken: string): Promise<string> {
        const result: any = await this.getRefreshTokenInfo(refreshToken)
        const {deviceId, userId, exp} = result
        const newRefreshToken = jwt.sign({userId: userId, deviceId: deviceId}, settings.JWT_REFRESH_SECRET, {expiresIn: "20s"})
        const newResult: any = await this.getRefreshTokenInfo(newRefreshToken)
        const newExpiredAt = new Date(newResult.exp*1000).toISOString()
        const newIssuedAt = new Date(newResult.iat*1000).toISOString()
        const expiredAt = new Date(exp*1000).toISOString()
        const isUpdated = await jwtRepository.updateRefreshToken(expiredAt, newExpiredAt, newIssuedAt)
        if (!isUpdated){
            console.log('Can not update')
        }
        await devicesRepository.updateDeviceLastActiveDate(deviceId, newIssuedAt)
        return newRefreshToken

    },

    async deleteSession(token: string): Promise<boolean> {
        const result: any = await this.getRefreshTokenInfo(token)
        const expirationDate = new Date(result.exp*1000).toISOString()
        return jwtRepository.deleteSession(expirationDate)

    },

    async getUserIdByAccessToken (token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_ACCESS_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    },

    async getUserByRefreshToken (token: string) {
        const result: any = jwt.verify(token, settings.JWT_REFRESH_SECRET)
        const userId = new ObjectId(result.userId)
        return await usersRepository.findUserById(userId)
    },

    async getRefreshTokenInfo (token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_REFRESH_SECRET)
            return result
        } catch (error) {
            return null
        }
    },

    async checkRefreshTokenInDb(refreshToken: string): Promise<boolean> {
        try {
            const result: any = await jwt.verify(refreshToken, settings.JWT_REFRESH_SECRET)
            const expirationDate = new Date(result.exp * 1000).toISOString()
            return await jwtRepository.findRefreshTokenByExpirationDate(expirationDate)
        } catch (error) {
            return false
        }
    }

}