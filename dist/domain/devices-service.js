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
exports.devicesService = void 0;
const jwt_service_1 = require("../application/jwt-service");
const devices_repository_1 = require("../repositories/devices/devices-repository");
exports.devicesService = {
    deleteDevice(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield jwt_service_1.jwtService.getRefreshTokenInfo(refreshToken);
            const deviceId = result.deviceId;
            return yield devices_repository_1.devicesRepository.deleteSessionById(deviceId);
        });
    }
};
