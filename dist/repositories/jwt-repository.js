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
exports.jwtRepository = void 0;
const db_1 = require("./db");
exports.jwtRepository = {
    saveRefreshTokenMeta(newDbToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.TokenModel.create(newDbToken);
        });
    },
    updateRefreshToken(expirationDate, newExpirationDate, newIssuedAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.TokenModel.updateOne({ expiredAt: expirationDate }, { $set: { expiredAt: newExpirationDate, issuedAt: newIssuedAt } });
            return result.modifiedCount === 1;
        });
    },
    findToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const isFound = yield db_1.TokenModel.findOne({ token: refreshToken });
            if (!isFound) {
                return false;
            }
            return true;
        });
    },
    deleteSession(expirationDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.TokenModel.deleteOne({ expiredAt: expirationDate });
            return result.deletedCount === 1;
        });
    },
    findRefreshTokenByExpirationDate(expirationDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundToken = yield db_1.TokenModel.findOne({ expiredAt: expirationDate });
            if (!foundToken) {
                return false;
            }
            return true;
        });
    }
};
