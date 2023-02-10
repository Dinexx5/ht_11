import {DeviceModelClass} from "../db";
import {ObjectId} from "mongodb";
import {DeviceDbModel, deviceViewModel} from "../../models/models";

class DevicesRepository {

    async saveNewDevice(newDevice: DeviceDbModel) {
        await DeviceModelClass.create(newDevice)
    }

    async updateDeviceLastActiveDate(deviceId: string, newIssuedAt: string) {
        await DeviceModelClass.updateOne({deviceId: deviceId}, {$set: {lastActiveDate: newIssuedAt}})
    }

    async getActiveSessions(userId: string):Promise<deviceViewModel[]> {
        const _id = new ObjectId(userId)
        const foundDevices = await DeviceModelClass.find({userId: _id}).lean()
        return foundDevices.map(device => ({
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.lastActiveDate,
            deviceId: device.deviceId
        }))
    }

    async deleteAllSessions(deviceId: string, userId: string): Promise<boolean> {
        const _id = new ObjectId(userId)
        const result = await DeviceModelClass.deleteMany( {$and: [{ userId: _id}, {deviceId: { $ne: deviceId }} ]})
        if (result.deletedCount) {
            return true
        }
        return false
    }

    async findDeviceByDeviceId(deviceId: string): Promise<DeviceDbModel | null> {
        const foundDevice = await DeviceModelClass.findOne({deviceId: deviceId})
        if (!foundDevice) {
            return null
        }
        return foundDevice
    }

    async deleteSessionById(deviceId: string): Promise<boolean> {
        const result = await DeviceModelClass.deleteOne({ deviceId: deviceId })
        return result.deletedCount === 1
    }

}
export const devicesRepository = new DevicesRepository()

