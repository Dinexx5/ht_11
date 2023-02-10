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
exports.devicesControllerInstance = exports.devicesRouter = void 0;
const express_1 = require("express");
const jwt_service_1 = require("../application/jwt-service");
const devices_repository_1 = require("../repositories/devices/devices-repository");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
exports.devicesRouter = (0, express_1.Router)({});
class DevicesController {
    getActiveSessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const result = yield jwt_service_1.jwtService.getRefreshTokenInfo(refreshToken);
            const userId = result.userId;
            const foundDevices = yield devices_repository_1.devicesRepository.getActiveSessions(userId);
            return res.send(foundDevices);
        });
    }
    deleteAllSessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const result = yield jwt_service_1.jwtService.getRefreshTokenInfo(refreshToken);
            const { deviceId, userId } = result;
            const isDeleted = yield devices_repository_1.devicesRepository.deleteAllSessions(deviceId, userId);
            if (!isDeleted) {
                console.log('Something wrong with delete operation');
            }
            return res.send(204);
        });
    }
    deleteSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const result = yield jwt_service_1.jwtService.getRefreshTokenInfo(refreshToken);
            const { userId } = result;
            const foundDevice = yield devices_repository_1.devicesRepository.findDeviceByDeviceId(req.params.deviceId);
            if (!foundDevice) {
                return res.send(404);
            }
            if (foundDevice.userId.toString() !== userId) {
                return res.send(403);
            }
            const isDeleted = yield devices_repository_1.devicesRepository.deleteSessionById(req.params.deviceId);
            if (!isDeleted) {
                console.log('Something wrong with delete operation');
            }
            return res.send(204);
        });
    }
}
exports.devicesControllerInstance = new DevicesController();
exports.devicesRouter.get('/', auth_middlewares_1.checkRefreshTokenMiddleware, exports.devicesControllerInstance.getActiveSessions.bind(exports.devicesControllerInstance));
exports.devicesRouter.delete('/', auth_middlewares_1.checkRefreshTokenMiddleware, exports.devicesControllerInstance.deleteAllSessions.bind(exports.devicesControllerInstance));
exports.devicesRouter.delete('/:deviceId', auth_middlewares_1.checkRefreshTokenMiddleware, exports.devicesControllerInstance.deleteSession.bind(exports.devicesControllerInstance));
