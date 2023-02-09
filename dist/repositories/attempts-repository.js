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
exports.attemptsRepository = void 0;
const db_1 = require("./db");
const mongodb_1 = require("mongodb");
exports.attemptsRepository = {
    addNewAttempt(requestData, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const newAttempt = {
                _id: new mongodb_1.ObjectId(),
                requestData: requestData,
                date: date
            };
            const attemptInstance = new db_1.AttemptModelClass(newAttempt);
            yield attemptInstance.save();
        });
    },
    countAttempts(requestData, tenSecondsAgo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.AttemptModelClass.countDocuments({ requestData: requestData, date: { $gte: tenSecondsAgo } });
        });
    }
};
