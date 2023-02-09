import {DeviceModel} from "../db";
import {ObjectId} from "mongodb";
import {deviceDbModel, deviceViewModel} from "../../models/models";


export const devicesRepository = {
    async saveNewDevice(newDevice: deviceDbModel) {
        await DeviceModel.create(newDevice)
    },

    async updateDeviceLastActiveDate(deviceId: string, newIssuedAt: string) {
        await DeviceModel.updateOne({deviceId: deviceId}, {$set: {lastActiveDate: newIssuedAt}})
    },

    async getActiveSessions(userId: string):Promise<deviceViewModel[]> {
        const _id = new ObjectId(userId)
        const foundDevices = await DeviceModel.find({userId: _id}).lean()
        return foundDevices.map(device => ({
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.lastActiveDate,
            deviceId: device.deviceId
        }))
    },

    async deleteAllSessions(deviceId: string, userId: string): Promise<boolean> {
        const _id = new ObjectId(userId)
        const result = await DeviceModel.deleteMany( {$and: [{ userId: _id}, {deviceId: { $ne: deviceId }} ]})
        if (result.deletedCount) {
            return true
        }
        return false
    },

    async findDeviceByDeviceId(deviceId: string): Promise<deviceDbModel | null> {
        const foundDevice = await DeviceModel.findOne({deviceId: deviceId})
        if (!foundDevice) {
            return null
        }
        return foundDevice
    },

    async deleteSessionById(deviceId: string): Promise<boolean> {
        const result = await DeviceModel.deleteOne({ deviceId: deviceId })
        return result.deletedCount === 1
    },

}