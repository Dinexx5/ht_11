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
exports.limiter = void 0;
const date_fns_1 = require("date-fns");
const attempts_repository_1 = require("../repositories/attempts-repository");
const limiter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { ip, url } = req;
    const requestData = ip + url;
    const dateNow = new Date().toISOString();
    yield attempts_repository_1.attemptsRepository.addNewAttempt(requestData, dateNow);
    const tenSecondsAgo = (0, date_fns_1.subSeconds)(new Date(dateNow), 10).toISOString();
    const requestsCount = yield attempts_repository_1.attemptsRepository.countAttempts(requestData, tenSecondsAgo);
    if (requestsCount > 5) {
        return res.status(429).send('too many requests');
    }
    return next();
});
exports.limiter = limiter;
