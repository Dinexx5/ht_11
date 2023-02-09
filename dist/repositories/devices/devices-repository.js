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
exports.devicesRepository = void 0;
const db_1 = require("../db");
const mongodb_1 = require("mongodb");
exports.devicesRepository = {
    saveNewDevice(newDevice) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.DeviceModel.create(newDevice);
        });
    },
    updateDeviceLastActiveDate(deviceId, newIssuedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.DeviceModel.updateOne({ deviceId: deviceId }, { $set: { lastActiveDate: newIssuedAt } });
        });
    },
    getActiveSessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = new mongodb_1.ObjectId(userId);
            const foundDevices = yield db_1.DeviceModel.find({ userId: _id }).lean();
            return foundDevices.map(device => ({
                ip: device.ip,
                title: device.title,
                lastActiveDate: device.lastActiveDate,
                deviceId: device.deviceId
            }));
        });
    },
    deleteAllSessions(deviceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = new mongodb_1.ObjectId(userId);
            const result = yield db_1.DeviceModel.deleteMany({ $and: [{ userId: _id }, { deviceId: { $ne: deviceId } }] });
            if (result.deletedCount) {
                return true;
            }
            return false;
        });
    },
    findDeviceByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundDevice = yield db_1.DeviceModel.findOne({ deviceId: deviceId });
            if (!foundDevice) {
                return null;
            }
            return foundDevice;
        });
    },
    deleteSessionById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.DeviceModel.deleteOne({ deviceId: deviceId });
            return result.deletedCount === 1;
        });
    },
};
